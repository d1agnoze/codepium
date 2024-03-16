import { INITIAL_MESSAGE_OBJECT, MessageObject } from "@/types/message.route";
import { Pagination } from "@/types/pagination.interface";
import { BehaviorSubject } from "rxjs";

export class PaginationPrefetcher<T> {
  /**
   * @property model current model
   */
  model: Pagination<T>;
  /**
   * @property next model that represent next node
   */
  next: Pagination<T> | null = DEFAULT;
  /**
   * @property prev model that represent previos node
   */
  prev: Pagination<T> | null = DEFAULT;
  /**
   * @property key unique id to store Prev Cache and prefetch cache
   */
  key: number;
  /**
   * @property error_out output stream for error
   */
  error_out: BehaviorSubject<MessageObject>;
  /**
   * @property fetchUrl url to fetch data
   */
  fetchUrl: string;
  /**
   * @property abortContorller AbortController
   * use to controll abort signal
   * @example
   * abortContorller.abort()
   */
  abortContorller: AbortController;
  /**
   * @property signal AbortSignal
   * pass into fetch, use to cancel fetch
   */
  signal: AbortSignal;
  /**
   * @property total_page total number of pages
   */
  total_page: number;

  /**
   * @param _model pagination model
   * @param _fetchUrl this must include seach params starter (e.g ? symbol) The api must also return Pagination<T> type
   */
  constructor(_model: Pagination<T>, _fetchUrl: string) {
    this.model = _model;
    this.fetchUrl = _fetchUrl;
    this.abortContorller = new AbortController();
    this.signal = this.abortContorller.signal;
    this.error_out = new BehaviorSubject<MessageObject>(INITIAL_MESSAGE_OBJECT);
    this.key = Math.random();

    this.total_page = Math.ceil(this.model.total / this.model.limit);

    this.prev;
  }

  /**
   * fetch the current node
   * @param page page number
   */
  async fetch(page: number): Promise<Pagination<T>> {
    this.abortContorller.abort();
    const res: Pagination<T> = await fetch(
      `${this.fetchUrl}&page=${page}&limit=${this.model.limit}`,
    )
      .then((res) => res.json());
    return res;
  }

  /**
   * prefetch the next node or previous node
   * @param node NEXT or PREV
   */
  prefetch(node: "NEXT" | "PREV") {
    if (!this.checkNetwork()) return;
    fetch(
      `${this.fetchUrl}&page=${
        node === "NEXT" ? this.model.page + 1 : this.model.page - 1
      }&limit=${this.model.limit}`,
      {
        signal: this.signal,
      },
    ).then((res) => res.json())
      .then((data: Pagination<T>) => {
        //do something
        localStorage.setItem(
          `${this.key}_${node}_PREFETCH`,
          JSON.stringify(data),
        );
      });
  }

  /**
   * @async you will need to pipe this async into omit() function
   * Go to previous node
   * @returns void
   * @example
   * pag.goTo(10).then(omit);
   */
  async goTo(index: number) {
    if (index === this.model.page + 1) {
      await this.goNext();
    } else if (index === this.model.page - 1) {
      await this.goPrev();
    } else if (index === this.model.page) {
      return;
    } else {
      if (index > this.total_page) {
        this.error_out.next({ message: "Index out of bounds", ok: false });
        return;
      }
      //empty the cache
      localStorage.removeItem(`${this.key}_NEXT_PREFETCH`);
      localStorage.removeItem(`${this.key}_PREV_PREFETCH`);

      this.model = await this.fetch(index);
      return;
    }
  }

  /**
   * @async you will need to pipe this async into omit() function
   * Go to previous node
   * @returns void
   * @example
   * pag.goNext().then(omit);
   */
  async goNext() {
    //check if there is next page
    if (this.hasNext()) {
      this.prev = this.model;
      // get the data then empty the cache
      const ls_key = `${this.key}_NEXT_PREFETCH`;
      const data: Pagination<T> = JSON.parse(
        localStorage.getItem(ls_key) ?? "",
      );
      localStorage.removeItem(ls_key);

      //bind the data
      if (data && data.data.length > 0) this.model = data;
      else this.model = await this.fetch(this.model.page + 1);

      if (this.hasNext()) this.prefetch("NEXT");
    } else {
      this.error_out.next({ message: "No more pages", ok: false });
    }
  }
  /**
   * @async you will need to pipe this async into omit() function
   * Go to previous node
   * @returns void
   * @example
   * pag.goPrev().then(omit);
   */
  async goPrev() {
    if (this.hasPrev()) {
      this.next = this.model;
      // get the data then empty the cache
      const ls_key = `${this.key}_PREV_PREFETCH`;
      const data: Pagination<T> = JSON.parse(
        localStorage.getItem(ls_key) ?? "",
      );
      localStorage.removeItem(ls_key);

      //bind the data
      if (data && data.data.length > 0) this.model = data;
      else this.model = await this.fetch(this.model.page - 1);

      if (this.hasPrev()) this.prefetch("PREV");
    } else {
      this.error_out.next({ message: "No more previous page", ok: false });
    }
  }

  /**
   * @param callback SetStateAction to update model
   */
  omit(callback: React.Dispatch<React.SetStateAction<T[]>>) {
    callback(this.model.data);
  }

  /**
   * @returns true if there is next page
   */
  hasNext() {
    return this.model.page < this.total_page;
  }

  /**
   * @returns true if there is prev page
   */
  hasPrev() {
    return this.model.page > 1;
  }

  /**
   * Check network speed
   * @returns true if connection is not slow
   */
  checkNetwork() {
    //@ts-ignore
    const connection = navigator.connection || navigator.mozConnection ||
      //@ts-ignore
      navigator.webkitConnection;
    if (
      connection && connection.effectiveType !== "slow-2g" &&
      connection.saveData !== true
    ) return true;

    return false;
  }
}

/**
 * @constant DEFAULT
 * default values for pagination
 */
const DEFAULT = {
  limit: 10,
  page: 1,
  total: 0,
  data: [],
};
