"use server";

import { getQuestions } from "./actions";
import { QuestionDataTable } from "@/components/question/question_data_table";
import { columns } from "./columns";

export default async function Page() {
  try {
    const data = await getQuestions();
    return (
      <div className="p-5">
        <h1 className="text-3xl font-bold mb-7">My Questions</h1>
        <QuestionDataTable
          data={data}
          columns={columns}
          filter_col={[{ key: "title", label: "Question's title" }]}
        />
      </div>
    );
  } catch (err: any) {
    throw err;
  }
}
