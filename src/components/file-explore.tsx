import { Fragment, useCallback, useMemo, useState } from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "./ui/resizable";
import Hint from "./hint";
import { Button } from "./ui/button";
import { CopyCheckIcon, CopyIcon } from "lucide-react";
import { CodeView } from "./code-view/code-view";
import { convertFilesToTree } from "@/lib/utils";
import { TreeView } from "./tree-view";
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./ui/breadcrumb";

type FileCollection = { [path: string]: string };

function getLanguageFormExtension(filename: string): string {
  const extention = filename.split(".").pop()?.toLowerCase();

  return extention || "text";
}

interface FileBreadcrumbProps {
  filepath: string;
}

const FileBreadcrumb = ({ filepath }: FileBreadcrumbProps) => {
  const pathSegments = filepath.split("/");

  const maxSegment = 4;

  const renderBredcrumbItems = () => {
    if (pathSegments.length <= maxSegment) {
      return pathSegments.map((segment, index) => {
        const isLast = index === pathSegments.length - 1;

        return (
          <Fragment key={index}>
            <BreadcrumbItem>
              {isLast ? (
                <BreadcrumbPage className="font-medium">
                  {segment}
                </BreadcrumbPage>
              ) : (
                <span className="text-muted-foreground">{segment}</span>
              )}
            </BreadcrumbItem>
            {!isLast && <BreadcrumbSeparator />}
          </Fragment>
        );
      });
    } else {
      const firstSegment = pathSegments[0];

      const lastSegment = pathSegments[pathSegments.length - 1];

      return (
        <>
          <BreadcrumbItem>
            <span className="text-muted-foreground">{firstSegment}</span>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbEllipsis />
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="font-medium">
                {lastSegment}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbItem>
        </>
      );
    }
  };

  return (
    <Breadcrumb>
      <BreadcrumbList>{renderBredcrumbItems()}</BreadcrumbList>
    </Breadcrumb>
  );
};

interface FileExplorerProps {
  file: FileCollection;
}

export const FileExplorer = ({ file }: FileExplorerProps) => {
  const [selectedFile, setSelectedFile] = useState<string | null>(() => {
    const fileKeys = Object.keys(file);
    return fileKeys.length > 0 ? fileKeys[0] : null;
  });

  const treData = useMemo(() => {
    return convertFilesToTree(file);
  }, [file]);

  const handleFileSelect = useCallback(
    (filepath: string) => {
      if (file[filepath]) {
        setSelectedFile(filepath);
      }
    },
    [file]
  );
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    if (selectedFile) {
      navigator.clipboard.writeText(file[selectedFile]);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    }
  }, [selectedFile, file]);
  return (
    <ResizablePanelGroup direction="horizontal">
      <ResizablePanel defaultSize={30} minSize={30} className="bg-sidebar">
        <TreeView
          data={treData}
          value={selectedFile}
          onSelect={handleFileSelect}
        />
      </ResizablePanel>
      <ResizableHandle className="hover:bg-primary transition-colors">
        <ResizablePanel defaultSize={70} minSize={50}>
          {selectedFile && file[selectedFile] ? (
            <div className="h-full w-full flex flex-col">
              <div className="border-b bg-sidebar px-4 py-2 flex justify-between items-center gap-x-2">
                <FileBreadcrumb filepath={selectedFile} />
                <Hint text="copy to clipboard" side="bottom">
                  <Button
                    variant="outline"
                    size="icon"
                    className="ml-auto"
                    onClick={handleCopy}
                    disabled={copied}
                  >
                    {copied ? <CopyCheckIcon /> : <CopyIcon />}
                    <CopyIcon />
                  </Button>
                </Hint>
              </div>
              <div className="flex-1 overflow-auto">
                <CodeView
                  code={file[selectedFile]}
                  lang={getLanguageFormExtension(selectedFile)}
                />
              </div>
            </div>
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              Select a file to view it&apos;s content
            </div>
          )}
        </ResizablePanel>
      </ResizableHandle>
    </ResizablePanelGroup>
  );
};
