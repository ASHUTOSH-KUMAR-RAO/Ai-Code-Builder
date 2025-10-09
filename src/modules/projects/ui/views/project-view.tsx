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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CodeIcon, CrownIcon, EyeIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FileExplorer } from "@/components/file-explore";

interface Props {
  projectId: string;
}

export const ProjectView = ({ projectId }: Props) => {
  const [activeFragment, setActiveFragment] = useState<Fragment | null>(null);
  const [tabState, setTabState] = useState<"Preview" | "Code">("Preview");

  return (
    <div className="h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel
          defaultSize={35}
          minSize={20}
          className="flex flex-col min-h-0 backdrop-blur-sm"
        >
          <Suspense
            fallback={
              <div className="p-4 animate-pulse">
                <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded-lg w-3/4"></div>
              </div>
            }
          >
            <ProjectHeader projectId={projectId} />
          </Suspense>
          <Suspense
            fallback={
              <div className="flex-1 flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-8 h-8 border-4 border-slate-300 border-t-slate-600 rounded-full animate-spin"></div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Loading Messages...
                  </p>
                </div>
              </div>
            }
          >
            <MessagesContainer
              projectId={projectId}
              activeFragment={activeFragment}
              setActiveFragment={setActiveFragment}
            />
          </Suspense>
        </ResizablePanel>

        <ResizableHandle
          withHandle
          className="bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
        />

        <ResizablePanel
          defaultSize={65}
          minSize={50}
          className="bg-white dark:bg-slate-950"
        >
          <Tabs
            className="h-full flex flex-col"
            defaultValue="Preview"
            value={tabState}
            onValueChange={(value) => setTabState(value as "Preview" | "Code")}
          >
            <div className="w-full flex items-center border-b border-slate-200 dark:border-slate-800 gap-x-3 px-4 py-3 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md">
              <TabsList className="p-1 bg-transparent border-0 rounded-lg">
                <TabsTrigger
                  value="Preview"
                  className="rounded-lg px-4 py-2 border-0 transition-all duration-300 data-[state=inactive]:bg-slate-200/40 data-[state=inactive]:dark:bg-slate-800/40 data-[state=inactive]:backdrop-blur-md data-[state=inactive]:text-slate-600 data-[state=inactive]:dark:text-slate-400 data-[state=active]:bg-gradient-to-r data-[state=active]:from-slate-300/60 data-[state=active]:to-slate-200/60 data-[state=active]:dark:from-slate-700/60 data-[state=active]:dark:to-slate-800/60 data-[state=active]:backdrop-blur-xl data-[state=active]:shadow-lg data-[state=active]:shadow-slate-300/50 data-[state=active]:dark:shadow-slate-900/50 data-[state=active]:text-slate-900 data-[state=active]:dark:text-slate-100 hover:bg-slate-300/50 hover:dark:bg-slate-700/50"
                  style={{
                    backdropFilter: "blur(12px)",
                    boxShadow:
                      tabState === "Preview"
                        ? "0 4px 16px 0 rgba(148, 163, 184, 0.2), inset 0 1px 0 0 rgba(255, 255, 255, 0.4)"
                        : "none",
                  }}
                >
                  <EyeIcon className="w-4 h-4 mr-2" />
                  <span className="font-medium">Demo</span>
                </TabsTrigger>
                <TabsTrigger
                  value="Code"
                  className="rounded-lg px-4 py-2 border-0 transition-all duration-300 data-[state=inactive]:bg-slate-200/40 data-[state=inactive]:dark:bg-slate-800/40 data-[state=inactive]:backdrop-blur-md data-[state=inactive]:text-slate-600 data-[state=inactive]:dark:text-slate-400 data-[state=active]:bg-gradient-to-r data-[state=active]:from-slate-300/60 data-[state=active]:to-slate-200/60 data-[state=active]:dark:from-slate-700/60 data-[state=active]:dark:to-slate-800/60 data-[state=active]:backdrop-blur-xl data-[state=active]:shadow-lg data-[state=active]:shadow-slate-300/50 data-[state=active]:dark:shadow-slate-900/50 data-[state=active]:text-slate-900 data-[state=active]:dark:text-slate-100 hover:bg-slate-300/50 hover:dark:bg-slate-700/50"
                  style={{
                    backdropFilter: "blur(12px)",
                    boxShadow:
                      tabState === "Code"
                        ? "0 4px 16px 0 rgba(148, 163, 184, 0.2), inset 0 1px 0 0 rgba(255, 255, 255, 0.4)"
                        : "none",
                  }}
                >
                  <CodeIcon className="w-4 h-4 mr-2" />
                  <span className="font-medium">Code</span>
                </TabsTrigger>
              </TabsList>

              <div className="ml-auto flex items-center gap-x-2">
                <Button
                  asChild
                  size="sm"
                  className="relative overflow-hidden bg-gradient-to-r from-cyan-400/90 to-teal-400/90 hover:from-cyan-500/90 hover:to-teal-500/90 text-slate-900 font-semibold shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 border-0 backdrop-blur-md transition-all duration-300 hover:scale-105"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(32, 178, 170, 0.85) 0%, rgba(72, 209, 204, 0.85) 100%)",
                    backdropFilter: "blur(10px)",
                    boxShadow:
                      "0 8px 32px 0 rgba(32, 178, 170, 0.37), inset 0 1px 0 0 rgba(255, 255, 255, 0.3)",
                  }}
                >
                  <Link
                    href="/pricing"
                    className="flex items-center gap-2 px-2"
                  >
                    <CrownIcon className="w-4 h-4" />
                    <span>Upgrade</span>
                  </Link>
                </Button>
              </div>
            </div>

            <TabsContent
              value="Preview"
              className="flex-1 m-0 p-0 overflow-auto"
            >
              {!!activeFragment ? (
                <FragmentWeb data={activeFragment} />
              ) : (
                <div className="h-full flex items-center justify-center text-slate-400 dark:text-slate-600">
                  <div className="text-center space-y-3">
                    <EyeIcon className="w-16 h-16 mx-auto opacity-50" />
                    <p className="text-lg font-medium">No Preview Available</p>
                    <p className="text-sm">Select a fragment to preview</p>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent
              value="Code"
              className="flex-1 m-0 overflow-auto bg-slate-50 dark:bg-slate-900 min-h-0"
            >
              <div className="h-full">
                {!!activeFragment?.files && (
                  <FileExplorer
                    file={activeFragment.files as { [path: string]: string }}
                  />
                )}
              </div>
            </TabsContent>
          </Tabs>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};
