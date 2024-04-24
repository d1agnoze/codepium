import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import { POINT_SYS, POINT_SYS_GUARD } from "@/defaults/points.system";

export default async function Page() {
  return (
    <div className="mx-5 w-full border-box p-5">
      <h1 className="font-bold text-2xl">Codepium guidelines</h1>
      <Separator className="my-2" />
      <p>
        Codepium is an open source question & answer platform for developers
      </p>
      <h2 className="font-semibold text-xl mt-4">Reputation</h2>
      <Separator className="my-1" />
      <Accordion type="single" collapsible className="max-md:w-full md:w-3/4">
        <AccordionItem value="item-1">
          <AccordionTrigger>What is reputation?</AccordionTrigger>
          <AccordionContent>
            Reputation is a grading system for Codepium users, based theirs
            activities on the platform. User can gain reputation points by doing
            some specific actions. Some feature can be unlocked by having enough
            reputation.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>
            What can i do with enough reputation?
          </AccordionTrigger>
          <AccordionContent>
            <p className="font-bold"> You can do the following: </p>
            <ul className="list-disc ml-5">
              <li>
                Upload images:{" "}
                <span className="text-success">{POINT_SYS_GUARD.upload}</span>
              </li>
              <li>
                Post:{" "}
                <span className="text-success">{POINT_SYS_GUARD.post}</span>
              </li>
              <li>
                Comment:{" "}
                <span className="text-success">{POINT_SYS_GUARD.comment}</span>
              </li>
            </ul>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>How do i gain more reputation?</AccordionTrigger>
          <AccordionContent>
            <p className="font-bold">You can do the following:</p>
            <ul className="list-disc ml-5">
              <li>
                Ask question:{" "}
                <span className="text-success">{POINT_SYS.question}</span>
              </li>
              <li>
                Answer question:{" "}
                <span className="text-success">{POINT_SYS.answer}</span>
              </li>
              <li>
                Getting your answer verified:{" "}
                <span className="text-success">
                  {POINT_SYS.verified_answer}
                </span>
              </li>
            </ul>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
