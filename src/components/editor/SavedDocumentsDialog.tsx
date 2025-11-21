import { useState, useEffect } from "react";
import { Trash2, FileText, Clock } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

export interface SavedDocument {
  id: string;
  name: string;
  content: string;
  timestamp: number;
  styleGuide?: string;
  englishVariant?: string;
}

interface SavedDocumentsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLoadDocument: (doc: SavedDocument) => void;
}

const STORAGE_KEY = "markdownlint-saved-docs";

export const SavedDocumentsDialog = ({
  open,
  onOpenChange,
  onLoadDocument,
}: SavedDocumentsDialogProps) => {
  const [documents, setDocuments] = useState<SavedDocument[]>([]);

  useEffect(() => {
    if (open) {
      loadDocuments();
    }
  }, [open]);

  const loadDocuments = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const docs = JSON.parse(saved) as SavedDocument[];
        setDocuments(docs.sort((a, b) => b.timestamp - a.timestamp));
      }
    } catch (error) {
      console.error("Failed to load documents:", error);
      toast.error("Failed to load saved documents");
    }
  };

  const handleDelete = (id: string) => {
    try {
      const updated = documents.filter(doc => doc.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      setDocuments(updated);
      toast.success("Document deleted");
    } catch (error) {
      console.error("Failed to delete document:", error);
      toast.error("Failed to delete document");
    }
  };

  const handleLoad = (doc: SavedDocument) => {
    onLoadDocument(doc);
    onOpenChange(false);
    toast.success(`Loaded "${doc.name}"`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Saved Documents</DialogTitle>
          <DialogDescription>
            Load or delete your saved markdown documents
          </DialogDescription>
        </DialogHeader>

        {documents.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No saved documents yet</p>
            <p className="text-sm text-muted-foreground mt-2">
              Save your work to access it later
            </p>
          </div>
        ) : (
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-2">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <FileText className="h-4 w-4 text-primary flex-shrink-0" />
                      <h4 className="font-medium truncate">{doc.name}</h4>
                    </div>
                    <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                      <span className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>{formatDistanceToNow(doc.timestamp, { addSuffix: true })}</span>
                      </span>
                      {doc.styleGuide && (
                        <span className="capitalize">{doc.styleGuide}</span>
                      )}
                      {doc.englishVariant && (
                        <span className="uppercase">{doc.englishVariant}</span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 truncate">
                      {doc.content.substring(0, 100)}...
                    </p>
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => handleLoad(doc)}
                    >
                      Load
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(doc.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </DialogContent>
    </Dialog>
  );
};

export const saveDocument = (
  name: string,
  content: string,
  styleGuide?: string,
  englishVariant?: string
): void => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    const documents: SavedDocument[] = saved ? JSON.parse(saved) : [];

    const newDoc: SavedDocument = {
      id: `doc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name,
      content,
      timestamp: Date.now(),
      styleGuide,
      englishVariant,
    };

    documents.push(newDoc);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(documents));
    toast.success(`Saved as "${name}"`);
  } catch (error) {
    console.error("Failed to save document:", error);
    toast.error("Failed to save document");
  }
};
