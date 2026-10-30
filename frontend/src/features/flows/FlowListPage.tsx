import { flowsApi } from "@/api/flows";
import { BrandMark } from "@/components/ui/BrandMark";
import { useAuthStore } from "@/stores/authStore";
import { useFlowListStore } from "@/stores/flowListStore";
import {
  AlertTriangle,
  Clock,
  Download,
  LogOut,
  Play,
  Plus,
  Shield,
  Trash2,
  Upload,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

/** Badge colors per (last-execution) status. */
const STATUS_BADGE: Record<string, string> = {
  running: "bg-ember-900/50 text-ember-300",
  completed: "bg-lime-900/40 text-lime-300",
  error: "bg-red-900/50 text-red-400",
  stopped: "bg-yellow-900/40 text-yellow-300",
};

/** The Intelliflow project team, shown in the page footer. */
const TEAM = ["Sai Preet Palam", "Vismay S", "Sneha P", "Sadiya Rehman"];

function statusBadgeClass(status: string): string {
  return STATUS_BADGE[status] ?? "bg-slate-800 text-slate-500";
}

export function FlowListPage() {
  const { flows, loading, fetchFlows, createFlow, deleteFlow } =
    useFlowListStore();
  const { logout, user } = useAuthStore();
  const navigate = useNavigate();
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchFlows();
  }, [fetchFlows]);

  const handleCreate = async () => {
    if (!newName.trim()) return;
    const id = await createFlow(newName.trim());
    setShowCreate(false);
    setNewName("");
    navigate(`/flow/${id}`);
  };

  const handleExport = async (
    e: React.MouseEvent,
    flowId: string,
    flowName: string,
  ) => {
    e.stopPropagation();
    try {
      const data = await flowsApi.export(flowId);
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${flowName.replace(/[^a-zA-Z0-9_-]/g, "_")}.intelliflow.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Export failed:", err);
    }
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      if (!data.flow) {
        alert("Invalid Intelliflow export file");
        return;
      }
      const result = await flowsApi.import(data);
      await fetchFlows();
      navigate(`/flow/${result.id}`);
    } catch (err) {
      console.error("Import failed:", err);
      alert(
        "Failed to import flow. Make sure the file is a valid Intelliflow export.",
      );
    }
    // Reset input so the same file can be re-imported
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="min-h-screen bg-slate-950 bg-ember-glow flex flex-col">
      {/* Hidden file input for import */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        className="hidden"
        onChange={handleImport}
      />

      {/* Top bar */}
      <div className="border-b border-slate-800/80 bg-slate-950/60 backdrop-blur">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <BrandMark subtitle="Workflow Studio" />
          <div className="flex items-center gap-3">
            {user && (
              <span className="text-xs text-slate-500">{user.email}</span>
            )}
            <Link
              to="/vault"
              className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
              title="Credential Vault"
            >
              <Shield size={16} />
            </Link>
            <button
              type="button"
              onClick={logout}
              className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
              title="Sign out"
            >
              <LogOut size={16} />
            </button>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 px-3 py-2 text-slate-300 hover:bg-slate-800
                text-sm rounded-lg transition-colors border border-slate-700"
              title="Import flow from JSON"
            >
              <Upload size={14} />
              Import
            </button>
            <button
              type="button"
              onClick={() => setShowCreate(true)}
              className="flex items-center gap-2 px-4 py-2 bg-ember-600 hover:bg-ember-700
                text-white text-sm font-medium rounded-lg transition-colors"
            >
              <Plus size={16} />
              New Flow
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl w-full mx-auto px-6 py-8 flex-1">
        <div className="mb-8">
          <h2 className="font-display text-3xl text-slate-50">
            Your workflows
          </h2>
          <p className="mt-1 text-sm text-slate-400">
            {flows.length === 0
              ? "Nothing here yet. Build your first automation below."
              : `${flows.length} flow${flows.length === 1 ? "" : "s"} · open one to edit, deploy or test it`}
          </p>
        </div>

        {/* Create dialog */}
        {showCreate && (
          <div className="mb-6 bg-slate-900 border border-slate-700 rounded-lg p-4">
            <h3 className="text-sm font-medium text-slate-200 mb-3">
              Create New Flow
            </h3>
            <div className="flex gap-3">
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                placeholder="Flow name..."
                className="flex-1 bg-slate-800 border border-slate-700 rounded-md px-3 py-2
                  text-sm text-slate-200 placeholder-slate-500 focus:outline-none
                  focus:border-ember-500"
              />
              <button
                type="button"
                onClick={handleCreate}
                className="px-4 py-2 bg-ember-600 hover:bg-ember-700 text-white text-sm
                  rounded-md transition-colors"
              >
                Create
              </button>
              <button
                type="button"
                onClick={() => setShowCreate(false)}
                className="px-4 py-2 text-slate-400 hover:bg-slate-800 text-sm
                  rounded-md transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Flow list */}
        {loading ? (
          <div className="text-center text-slate-500 py-20">
            Loading flows...
          </div>
        ) : flows.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mx-auto mb-4">
              <Play size={24} className="text-slate-600" />
            </div>
            <h2 className="text-lg font-medium text-slate-300 mb-2">
              No flows yet
            </h2>
            <p className="text-sm text-slate-500 mb-4">
              Create your first flow or import one
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setShowCreate(true)}
                className="px-4 py-2 bg-ember-600 hover:bg-ember-700 text-white text-sm
                  font-medium rounded-lg transition-colors"
              >
                Create Flow
              </button>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 px-4 py-2 text-slate-300 hover:bg-slate-800
                  text-sm rounded-lg transition-colors border border-slate-700"
              >
                <Upload size={14} />
                Import
              </button>
            </div>
          </div>
        ) : (
          <div className="grid gap-3">
            {flows.map((flow) => (
              // Card: a full-cover overlay button handles navigation so the
              // Export/Delete buttons aren't nested inside another button.
              <div
                key={flow.id}
                className="relative bg-slate-900/80 border border-slate-800 hover:border-ember-700/70
                  rounded-xl p-4 pl-5 transition-colors group overflow-hidden"
              >
                <span className="absolute left-0 top-0 bottom-0 w-1 bg-ember-gradient opacity-40 group-hover:opacity-100 transition-opacity" />
                <button
                  type="button"
                  onClick={() => navigate(`/flow/${flow.id}`)}
                  aria-label={`Open flow ${flow.name}`}
                  className="absolute inset-0 z-0 rounded-xl cursor-pointer"
                />
                <div className="relative z-10 pointer-events-none flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-slate-200 group-hover:text-white">
                      {flow.name}
                    </h3>
                    <div className="flex items-center gap-4 mt-1">
                      <span className="text-xs text-slate-500">
                        {flow.nodes} nodes &middot; {flow.edges} edges
                      </span>
                      <span className="flex items-center gap-1 text-xs text-slate-600">
                        <Clock size={10} />
                        {new Date(flow.updated_at).toLocaleDateString()}
                      </span>
                      {flow.last_run_at && (
                        <span className="flex items-center gap-1 text-xs text-slate-600">
                          <Play size={10} />
                          ran {new Date(flow.last_run_at).toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="pointer-events-auto flex items-center gap-2">
                    <span
                      className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${statusBadgeClass(
                        flow.status,
                      )}`}
                    >
                      {flow.status}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => handleExport(e, flow.id, flow.name)}
                      className="p-1.5 hover:bg-slate-800 rounded transition-colors opacity-0
                        group-hover:opacity-100"
                      title="Export flow"
                    >
                      <Download size={14} className="text-slate-400" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteTarget({ id: flow.id, name: flow.name });
                      }}
                      className="p-1.5 hover:bg-red-900/30 rounded transition-colors opacity-0
                        group-hover:opacity-100"
                    >
                      <Trash2 size={14} className="text-red-400" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-800/80">
        <div className="max-w-5xl mx-auto px-6 py-4 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500">
          <span>Intelliflow &middot; Final Year Project</span>
          <span>Built by {TEAM.join(" · ")}</span>
        </div>
      </footer>

      {/* Delete confirmation modal */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-slate-900 border border-slate-700 rounded-lg p-6 max-w-sm w-full mx-4 shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-900/30 flex items-center justify-center">
                <AlertTriangle size={20} className="text-red-400" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-200">
                  Delete Flow
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  This action cannot be undone
                </p>
              </div>
            </div>
            <p className="text-sm text-slate-300 mb-6">
              Are you sure you want to delete{" "}
              <span className="font-medium text-white">
                "{deleteTarget.name}"
              </span>
              ?
            </p>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 text-sm text-slate-400 hover:bg-slate-800 rounded-md transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  deleteFlow(deleteTarget.id);
                  setDeleteTarget(null);
                }}
                className="px-4 py-2 text-sm bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
