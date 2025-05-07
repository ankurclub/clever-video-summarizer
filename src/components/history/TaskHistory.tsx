
import React, { useState } from 'react';
import { History, Download, Trash2, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { getStoredResults, deleteStoredResult, downloadTextFile } from '@/utils/videoProcessor';
import { useAuth } from '@/contexts/AuthContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';

interface TaskHistoryProps {
  variant?: 'default' | 'callToAction';
}

const TaskHistory: React.FC<TaskHistoryProps> = ({ variant = 'default' }) => {
  const { toast } = useToast();
  const { user, userPlan } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedContent, setSelectedContent] = useState<string | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string>('');

  const formatTimestamp = (timestamp: string): string => {
    try {
      const date = new Date(timestamp);
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric'
      }).format(date);
    } catch {
      return 'Unknown date';
    }
  };

  const formatBytes = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' bytes';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  const formatType = (type: string): string => {
    switch (type) {
      case 'subtitles': return 'Subtitles';
      case 'transcription': return 'Transcript';
      case 'summary': return 'Summary';
      case 'translation': return 'Translation';
      default: return type.charAt(0).toUpperCase() + type.slice(1);
    }
  };

  const handleDelete = (id: string) => {
    if (deleteStoredResult(id)) {
      toast({
        title: "Item deleted",
        description: "The task history item has been removed",
      });
      // Force refresh of component
      setIsDialogOpen(false);
      setTimeout(() => setIsDialogOpen(true), 100);
    } else {
      toast({
        title: "Error",
        description: "Failed to delete the item",
        variant: "destructive",
      });
    }
  };

  const handleDownload = (content: string, fileName: string, type: string) => {
    const extension = type === 'subtitles' ? '.srt' : '.txt';
    downloadTextFile(content, `${fileName}${extension}`);
    toast({
      title: "Download started",
      description: `Your ${type} file is being downloaded`,
    });
  };

  const handlePreview = (content: string, fileName: string) => {
    setSelectedContent(content);
    setSelectedFileName(fileName);
  };

  const historyItems = user ? getStoredResults(user.id, userPlan) : [];

  if (userPlan !== 'business') {
    if (variant === 'callToAction') {
      return (
        <Button 
          className="border-white bg-white/20 text-white hover:bg-white/30"
          onClick={() => window.location.href = '/pricing'}
          title="Upgrade to Business plan to access history"
        >
          <History className="mr-2 h-4 w-4" /> View History
        </Button>
      );
    }
    
    return (
      <Button 
        size="icon" 
        variant="outline"
        className="ml-2 w-8 h-8 rounded-full"
        onClick={() => window.location.href = '/pricing'}
        title="Upgrade to Business plan to access history"
      >
        <History className="h-4 w-4" />
      </Button>
    );
  }

  return (
    <>
      {variant === 'callToAction' ? (
        <Button 
          className="border-white bg-white/20 text-white hover:bg-white/30"
          onClick={() => setIsDialogOpen(true)}
          title="View Task History"
        >
          <History className="mr-2 h-4 w-4" /> View History
        </Button>
      ) : (
        <Button 
          size="icon"
          variant="outline"
          className="ml-2 w-8 h-8 rounded-full"
          onClick={() => setIsDialogOpen(true)}
          title="View Task History"
        >
          <History className="h-4 w-4" />
        </Button>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle className="text-xl flex items-center gap-2">
              <History className="h-5 w-5" /> Processing History
            </DialogTitle>
          </DialogHeader>

          {historyItems.length === 0 ? (
            <div className="py-8 text-center">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No processing history found.</p>
              <p className="text-sm text-muted-foreground mt-1">
                Your processed files will appear here.
              </p>
            </div>
          ) : (
            <div className="max-h-[60vh] overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {historyItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{formatType(item.type)}</TableCell>
                      <TableCell>{formatTimestamp(item.timestamp)}</TableCell>
                      <TableCell>{formatBytes(item.fileSize)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            size="icon" 
                            variant="outline"
                            onClick={() => handlePreview(item.content, item.fileName)}
                            title="Preview"
                          >
                            <FileText className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="icon" 
                            variant="outline"
                            onClick={() => handleDownload(item.content, item.fileName, item.type)}
                            title="Download"
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="icon" 
                            variant="outline" 
                            className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                            onClick={() => handleDelete(item.id)}
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {selectedContent && (
            <div className="mt-4 border rounded-md p-4 max-h-72 overflow-y-auto bg-muted/50">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium">{selectedFileName}</h3>
                <Button 
                  size="sm" 
                  variant="ghost"
                  onClick={() => setSelectedContent(null)}
                >
                  Close Preview
                </Button>
              </div>
              <pre className="text-sm whitespace-pre-wrap">{selectedContent}</pre>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TaskHistory;
