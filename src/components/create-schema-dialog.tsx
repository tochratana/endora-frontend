"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Input from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  GripVertical,
  Settings,
  X,
  ChevronDown,
  Link,
  Database,
  ArrowRight,
} from "lucide-react";
import {
  useCreateSchemaMutation,
  type SchemaDefinition,
} from "@/service/apiSlide/schemaApi";

interface Column {
  id: string;
  name: string;
  type: string;
  defaultValue: string;
  isPrimary: boolean;
}

interface CreateSchemaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectUuid: string;
  onSave?: (schema: {
    name: string;
    description: string;
    columns: Column[];
  }) => void;
}

export function CreateSchemaDialog({
  open,
  onOpenChange,
  projectUuid,
  onSave,
}: CreateSchemaDialogProps) {
  const [schemaName, setSchemaName] = useState("");
  const [description, setDescription] = useState("");
  const [columns, setColumns] = useState<Column[]>([
    { id: "1", name: "id", type: "int", defaultValue: "NULL", isPrimary: true },
    {
      id: "2",
      name: "columns_name",
      type: "",
      defaultValue: "NULL",
      isPrimary: false,
    },
  ]);

  const [createSchema, { isLoading, error }] = useCreateSchemaMutation();

  // Debug log to check projectUuid
  console.log("CreateSchemaDialog projectUuid:", projectUuid);

  const addColumn = () => {
    const newColumn: Column = {
      id: Date.now().toString(),
      name: "",
      type: "",
      defaultValue: "NULL",
      isPrimary: false,
    };
    setColumns([...columns, newColumn]);
  };

  const updateColumn = (
    id: string,
    field: keyof Column,
    value: string | boolean
  ) => {
    setColumns(
      columns.map(col => (col.id === id ? { ...col, [field]: value } : col))
    );
  };

  const removeColumn = (id: string) => {
    setColumns(columns.filter(col => col.id !== id));
  };

  // Helper function to convert columns to schema format
  const convertColumnsToSchema = (columns: Column[]): SchemaDefinition => {
    const schema: SchemaDefinition = {};

    columns.forEach(column => {
      if (column.name && column.type) {
        // Only include columns with names and types
        let sqlDefinition = "";

        // Handle different data types
        switch (column.type.toLowerCase()) {
          case "varchar":
            sqlDefinition = "VARCHAR(255)";
            break;
          case "text":
            sqlDefinition = "TEXT";
            break;
          case "int":
            sqlDefinition = column.isPrimary ? "SERIAL PRIMARY KEY" : "INT";
            break;
          case "boolean":
            sqlDefinition = "BOOLEAN";
            break;
          case "timestamp":
            sqlDefinition = "TIMESTAMP";
            break;
          case "date":
            sqlDefinition = "DATE";
            break;
          case "decimal":
            sqlDefinition = "DECIMAL(10,2)";
            break;
          case "float":
            sqlDefinition = "FLOAT";
            break;
          default:
            sqlDefinition = column.type.toUpperCase();
        }

        // Add PRIMARY KEY for non-int types
        if (column.isPrimary && column.type.toLowerCase() !== "int") {
          sqlDefinition += " PRIMARY KEY";
        }

        // Add NOT NULL if default is not NULL and not primary key
        if (column.defaultValue !== "NULL" && !column.isPrimary) {
          sqlDefinition += " NOT NULL";
        }

        schema[column.name] = sqlDefinition;
      }
    });

    return schema;
  };

  const handleSave = async () => {
    if (!schemaName.trim()) {
      alert("Please enter a schema name");
      return;
    }

    if (columns.length === 0) {
      alert("Please add at least one column");
      return;
    }

    try {
      const schema = convertColumnsToSchema(columns);

      await createSchema({
        schemaName: schemaName.trim(),
        schema,
        projectUuid,
      }).unwrap();

      // Call the original onSave if provided
      if (onSave) {
        onSave({ name: schemaName, description, columns });
      }

      // Reset form and close dialog
      setSchemaName("");
      setDescription("");
      setColumns([
        {
          id: "1",
          name: "id",
          type: "int",
          defaultValue: "NULL",
          isPrimary: true,
        },
        {
          id: "2",
          name: "",
          type: "",
          defaultValue: "NULL",
          isPrimary: false,
        },
      ]);
      onOpenChange(false);
    } catch (err) {
      console.error("Failed to create schema:", err);
      alert("Failed to create schema. Please try again.");
    }
  };

  const handleCancel = () => {
    setSchemaName("");
    setDescription("");
    setColumns([
      {
        id: "1",
        name: "id",
        type: "int",
        defaultValue: "NULL",
        isPrimary: true,
      },
      {
        id: "2",
        name: "created_date",
        type: "timestamp",
        defaultValue: "NULL",
        isPrimary: false,
      },
    ]);
    onOpenChange(false);
  };

  const [isFKDialogOpen, setIsFKDialogOpen] = useState(false);
  const handleSaveFK = (fk: unknown) => {
    console.log("Schema saved:", fk);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl w-[95vw] max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-950 dark:text-gray-100">
        <DialogHeader>
          <DialogTitle className="text-lg font-medium">
            Create new Schema
          </DialogTitle>
        </DialogHeader>
        <hr className="border-gray-200 dark:border-gray-700" />

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-3">
              <p className="text-sm text-red-600 dark:text-red-400">
                Error creating schema:{" "}
                {error && "data" in error
                  ? String(error.data)
                  : "Unknown error"}
              </p>
            </div>
          )}

          {/* Schema Name and Description */}
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="schema-name" className="text-sm font-medium">
                Name
              </Label>
              <Input
                id="schema-name"
                value={schemaName}
                onChange={e => setSchemaName(e.target.value)}
                className="bg-transparent border-gray-200 dark:border-gray-700"
              />
            </div>

          {/* Columns Section */}
          <div className="space-y-4">
            <hr className="border-gray-200 dark:border-gray-700" />
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">Columns</h3>
              <div className="flex gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center bg-teal-100 text-teal-700 dark:bg-teal-800 dark:text-teal-100 border-gray-300 rounded-sm px-2 py-1 hover:bg-teal-200 dark:hover:bg-teal-700">
                      Reuse Schema
                      <ChevronDown className="ml-1 h-4 w-4 pt-0.5" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-white dark:bg-gray-800 dark:text-gray-100">
                    <DropdownMenuItem className="grid grid-cols-2 gap-6">
                      Product{" "}
                      <span className="text-xs text-gray-400">ecommerce</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="grid grid-cols-2 gap-6">
                      User{" "}
                      <span className="text-xs text-gray-400">ecommerce</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <button className="bg-indigo-400/60 text-indigo-800 dark:bg-indigo-700 dark:text-indigo-100 rounded-sm px-2 py-1 border-gray-300 hover:bg-indigo-600/50">
                  Import File
                </button>
              </div>
            </div>
            <hr className="border-gray-200 dark:border-gray-700" />

            {/* Column Headers */}
            <div className="grid grid-cols-12 gap-2 text-xs font-medium text-gray-600 dark:text-gray-300 px-2">
              <div className="col-span-1"></div>
              <div className="col-span-3">Name</div>
              <div className="col-span-3">Type</div>
              <div className="col-span-3">Default Value</div>
              <div className="col-span-1">Primary</div>
              <div className="col-span-1"></div>
            </div>

            {/* Column Rows */}
            <div className="space-y-2">
              {columns.map(column => (
                <div
                  key={column.id}
                  className="grid grid-cols-12 gap-2 items-center bg-gray-50 dark:bg-slate-950 p-2 rounded"
                >
                  {/* Drag Handle */}
                  <div className="col-span-1 flex justify-center">
                    <GripVertical className="h-4 w-4 text-gray-400 cursor-grab" />
                  </div>

                  {/* Column Name */}
                  <div className="col-span-3">
                    <div className="flex rounded-md shadow-sm">
                      <Input
                        value={column.name}
                        onChange={e =>
                          updateColumn(column.id, "name", e.target.value)
                        }
                        className="bg-transparent text-sm border-gray-200 dark:border-gray-700 rounded-l-md rounded-r-none focus:ring-0 dark:bg-gray-950"
                        placeholder="Column name"
                      />
                      <button
                        type="button"
                        onClick={() => setIsFKDialogOpen(true)}
                        className="inline-flex items-center px-2 border border-l-0 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950 rounded-r-md"
                      >
                        <Link className="h-4 w-4 text-gray-800 dark:text-gray-100" />
                      </button>
                    </div>
                  </div>

                  {/* Column Type */}
                  <div className="col-span-3">
                    <Select
                      value={column.type}
                      onValueChange={value =>
                        updateColumn(column.id, "type", value)
                      }
                    >
                      <SelectTrigger className="w-full bg-white dark:bg-gray-950">
                        <SelectValue placeholder="Choose a data type" />
                      </SelectTrigger>
                      <SelectContent className="bg-white dark:bg-gray-950 dark:text-gray-100">
                        <SelectItem value="int">int</SelectItem>
                        <SelectItem value="varchar">varchar</SelectItem>
                        <SelectItem value="text">text</SelectItem>
                        <SelectItem value="boolean">boolean</SelectItem>
                        <SelectItem value="timestamp">timestamp</SelectItem>
                        <SelectItem value="date">date</SelectItem>
                        <SelectItem value="decimal">decimal</SelectItem>
                        <SelectItem value="float">float</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Default Value */}
                  <div className="col-span-3">
                    <Input
                      value={column.defaultValue}
                      onChange={e =>
                        updateColumn(column.id, "defaultValue", e.target.value)
                      }
                      className="text-sm text-gray-400 bg-transparent border-gray-200 dark:border-gray-700 dark:bg-gray-950"
                      placeholder="NULL"
                    />
                  </div>

                  {/* Primary Key */}
                  <div className="col-span-2 flex justify-center items-center gap-2">
                    <input
                      type="radio"
                      name="primary-key"
                      checked={column.isPrimary}
                      onChange={e => {
                        if (e.target.checked) {
                          setColumns(
                            columns.map(col => ({
                              ...col,
                              isPrimary: col.id === column.id,
                            }))
                          );
                        }
                      }}
                      className="w-4 h-4 accent-teal-500"
                    />

                    {/* Actions */}
                    <div className="flex justify-center gap-1">
                      <button className="h-4 w-4 p-0">
                        <Settings className="h-4 w-4 mx-auto text-gray-400" />
                      </button>
                      <button
                        className="h-4 w-4 p-0"
                        onClick={() => removeColumn(column.id)}
                      >
                        <X className="h-4 w-4 mx-auto text-gray-400" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-center border border-gray-200 dark:border-gray-700 py-3">
              <button
                onClick={addColumn}
                className="w-fit text-sm bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600 py-1 px-3 rounded-sm"
              >
                Add column
              </button>
            </div>
          </div>

          {/* Foreign Keys Section */}
          <div className="space-y-4">
            <hr className="border-gray-200 dark:border-gray-700" />
            <h3 className="text-sm font-medium">Foreign Keys</h3>
            <hr className="border-gray-200 dark:border-gray-700" />
            <div className="flex justify-center border border-gray-200 dark:border-gray-700 py-3">
              <button
                onClick={() => setIsFKDialogOpen(true)}
                className="w-fit text-sm bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600 py-1 px-3 rounded-sm"
              >
                Add foreign key relation
              </button>
            </div>
          </div>

          {/* FK Dialog */}
          <Dialog open={isFKDialogOpen} onOpenChange={setIsFKDialogOpen}>
            <DialogContent className="max-w-6xl w-[95vw] max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-950 dark:text-gray-100">
              <DialogHeader>
                <DialogTitle className="text-lg font-medium">
                  Add Foreign Key
                </DialogTitle>
              </DialogHeader>
              <hr className="border-gray-200 dark:border-gray-700" />

              <div className="flex items-center justify-between">
                <div className="w-full">
                  <span className="text-md font-semibold">Select Schema</span>
                </div>
                <Select>
                  <SelectTrigger className="w-full bg-white dark:bg-transparent">
                    <SelectValue placeholder="Select Schema" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-gray-950 dark:text-gray-100">
                    <SelectItem value="product">
                      <Database /> Product
                    </SelectItem>
                    <SelectItem value="user">
                      <Database /> User
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-6">
                <div className="space-y-4">
                  <hr className="border-gray-200 dark:border-gray-700" />
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium">
                      Select column from{" "}
                      <span className="text-teal-800 dark:text-teal-300">
                        product
                      </span>{" "}
                      to reference to
                    </h3>
                  </div>

                  <div className="space-y-2">
                    {columns.map(column => (
                      <div
                        key={column.id}
                        className="flex items-center gap-4 bg-gray-50 dark:bg-slate-950 p-2 rounded"
                      >
                        <div className="w-full">
                          <Select>
                            <SelectTrigger className="w-full bg-white dark:bg-gray-950">
                              <SelectValue placeholder="---" />
                            </SelectTrigger>
                            <SelectContent className="bg-white dark:bg-gray-950 dark:text-gray-100">
                              <SelectItem value="id">id</SelectItem>
                              <SelectItem value="created_at">
                                created_at
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <ArrowRight className="w-8 h-8" />
                        <div className="w-full">
                          <Select>
                            <SelectTrigger className="w-full bg-white dark:bg-gray-950">
                              <SelectValue placeholder="---" />
                            </SelectTrigger>
                            <SelectContent className="bg-white dark:bg-gray-950 dark:text-gray-100">
                              <SelectItem value="id">id</SelectItem>
                              <SelectItem value="created_at">
                                created_at
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="flex justify-center gap-1">
                          <button
                            className="h-4 w-4 p-0"
                            onClick={() => removeColumn(column.id)}
                          >
                            <X className="h-4 w-4 mx-auto text-gray-400" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-center border border-gray-200 dark:border-gray-700 py-3">
                    <button
                      onClick={addColumn}
                      className="w-fit text-sm bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600 py-1 px-3 rounded-sm"
                    >
                      Add column
                    </button>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button
                    className="text-sm bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600 py-1 px-3 rounded-sm"
                    onClick={handleCancel}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={isLoading}
                    className="text-sm text-white bg-teal-500 hover:bg-teal-600 disabled:bg-gray-400 disabled:cursor-not-allowed py-1 px-3 rounded-sm flex items-center gap-2"
                  >
                    {isLoading && (
                      <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                    )}
                    {isLoading ? "Creating..." : "Save"}
                  </button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              className="text-sm bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600 py-1 px-3 rounded-sm"
              onClick={handleCancel}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isLoading}
              className="text-sm text-white bg-teal-500 hover:bg-teal-600 disabled:bg-gray-400 disabled:cursor-not-allowed py-1 px-3 rounded-sm flex items-center gap-2"
            >
              {isLoading && (
                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
              )}
              {isLoading ? "Creating..." : "Save"}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
