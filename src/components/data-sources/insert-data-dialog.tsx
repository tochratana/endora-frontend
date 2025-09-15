"use client";

import { useState } from "react";
import Button from "@/components/button/Button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Plus, Loader2 } from "lucide-react";
import { useInsertDataMutation } from "@/service/apiSlide/dataSourceApi";
import { useGetSchemasQuery } from "@/service/apiSlide/schemaApi";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface InsertDataDialogProps {
  projectUuid: string;
  userUuid: string;
}

export function InsertDataDialog({
  projectUuid,
  userUuid,
}: InsertDataDialogProps) {
  const [open, setOpen] = useState(false);
  const [selectedSchema, setSelectedSchema] = useState<string>("");
  const [formData, setFormData] = useState<Record<string, string>>({});

  const { data: schemas } = useGetSchemasQuery(projectUuid);
  const [insertData, { isLoading }] = useInsertDataMutation();

  // Get the selected schema details
  const currentSchema = schemas?.find(schema => schema.id === selectedSchema);

  // Parse schema columns for form fields
  const schemaColumns = currentSchema?.columns
    ? Object.entries(currentSchema.columns)
        .map(([name, definition]) => ({
          name,
          definition: definition as string,
          isRequired: definition.includes("NOT NULL"),
          isPrimary: definition.includes("PRIMARY KEY"),
        }))
        .filter(col => !col.isPrimary) // Exclude primary key fields from form
    : [];

  const handleInputChange = (fieldName: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedSchema || !currentSchema) {
      alert("Please select a schema");
      return;
    }

    // Validate required fields
    const missingFields = schemaColumns
      .filter(col => col.isRequired && !formData[col.name])
      .map(col => col.name);

    if (missingFields.length > 0) {
      alert(`Missing required fields: ${missingFields.join(", ")}`);
      return;
    }

    try {
      await insertData({
        schemaName: currentSchema.schemaName,
        projectUuid,
        userUuid,
        data: formData,
      }).unwrap();

      alert("Data inserted successfully!");

      // Reset form and close dialog
      setFormData({});
      setSelectedSchema("");
      setOpen(false);
    } catch (error) {
      console.error("Failed to insert data:", error);
      alert("Failed to insert data. Please try again.");
    }
  };

  const resetForm = () => {
    setFormData({});
    setSelectedSchema("");
  };

  return (
    <Dialog
      open={open}
      onOpenChange={newOpen => {
        setOpen(newOpen);
        if (!newOpen) {
          resetForm();
        }
      }}
    >
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Data
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Insert Data</DialogTitle>
          <DialogDescription>
            Add new data to your selected schema table.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Schema Selection */}
          <div className="space-y-2">
            <Label htmlFor="schema-select">Select Schema</Label>
            <Select value={selectedSchema} onValueChange={setSelectedSchema}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a schema..." />
              </SelectTrigger>
              <SelectContent>
                {schemas?.map(schema => (
                  <SelectItem key={schema.id} value={schema.id}>
                    {schema.schemaName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Dynamic Form Fields */}
          {selectedSchema && schemaColumns.length > 0 && (
            <div className="space-y-4 border-t pt-4">
              <h4 className="font-medium text-sm">Schema Fields</h4>
              {schemaColumns.map(column => (
                <div key={column.name} className="space-y-2">
                  <Label
                    htmlFor={column.name}
                    className="flex items-center gap-1"
                  >
                    {column.name}
                    {column.isRequired && (
                      <span className="text-red-500 text-xs">*</span>
                    )}
                  </Label>
                  <input
                    id={column.name}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                    value={formData[column.name] || ""}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleInputChange(column.name, e.target.value)
                    }
                    placeholder={`Enter ${column.name}...`}
                    required={column.isRequired}
                  />
                  <p className="text-xs text-muted-foreground">
                    Type: {column.definition}
                  </p>
                </div>
              ))}
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={!selectedSchema || isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Inserting...
                </>
              ) : (
                "Insert Data"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
