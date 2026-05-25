import { useRef, useState } from "react";
import { Button } from "@workspace/ui/button";
import { Input } from "@workspace/ui/input";
import { uploadImage } from "@/lib/api";
import { useToast } from "@workspace/ui/hooks/use-toast";
import { Upload, Loader2 } from "lucide-react";
import { resolveImg } from "@/hooks/useAmandaContent";

interface Props {
  value: string;
  onChange: (newUrl: string) => void;
  fallback?: string;
  label?: string;
}

export function ImageUpload({ value, onChange, fallback = "amanda-headshot.png", label }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  async function handlePick(file: File) {
    setUploading(true);
    try {
      const url = await uploadImage(file);
      onChange(url);
      toast({ title: "Image uploaded", description: "Don't forget to save your changes." });
    } catch (err) {
      toast({ title: "Upload failed", description: (err as Error).message, variant: "destructive" });
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-3">
      {label && <p className="text-sm font-medium">{label}</p>}
      <div className="flex items-start gap-4">
        <div className="w-32 h-32 rounded-lg border border-border bg-muted overflow-hidden shrink-0">
          {value || fallback ? (
            <img src={resolveImg(value, fallback)} alt="Preview" className="w-full h-full object-cover" />
          ) : null}
        </div>
        <div className="flex-1 space-y-2">
          <Input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Image URL or upload below"
            className="text-sm"
          />
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handlePick(f);
              e.target.value = "";
            }}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
          >
            {uploading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
            {uploading ? "Uploading…" : "Upload new image"}
          </Button>
        </div>
      </div>
    </div>
  );
}
