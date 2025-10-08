"use client";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { MessagesContainer } from "../components/messages-container";
import { Suspense, useState } from "react";
import { Fragment } from "@/generated/prisma";
import { ProjectHeader } from "../components/project-header";
import FragmentWeb from "../components/fragment-web";

interface Props {
  projectId: string;
}

export const ProjectView = ({ projectId }: Props) => {
  const [activeFragment, setActiveFragment] = useState<Fragment | null>(null);
  /*
  const trpc = useTRPC();

  const { data: project } = useSuspenseQuery(  pta hai iske wajah se hi jo mera message ka content wala page hai n block ho jaa raha hai kyuki humne yeha per suspenseQuery use kiiya hai thik hai aur jaab ye useSuspense call ho raha hai n to pta hai jo project ke andar page.tsx mein humne suspense use kiya hai n wo call ho rehe hai jiske wajah se mera message wala page block ho jaa raha hai aur whole page or project re rander ho raha hai ✅,isiliey humne isko apne project view se hi remove kr diya hai
    trpc.projects.getOne.queryOptions({ id: projectId })
  );

  */

  return (
    <div className="h-screen">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel
          defaultSize={35}
          minSize={20}
          className="flex flex-col min-h-0"
        >
          <Suspense fallback={<p>Loading Projects..</p>}>
            <ProjectHeader projectId={projectId} />
          </Suspense>
          <Suspense fallback={<p>Loading Messages..</p>}>
            <MessagesContainer
              projectId={projectId}
              activeFragment={activeFragment}
              setActiveFragment={setActiveFragment}
            />
          </Suspense>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={65} minSize={50}>
          {!!activeFragment && <FragmentWeb data={activeFragment}/>}
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};
