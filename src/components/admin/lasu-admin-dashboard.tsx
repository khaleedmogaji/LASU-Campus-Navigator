import "../src/admin-dashboard.css";
import { useState, useEffect, useMemo, ReactNode, FormEvent } from "react";
import {
  MapPin,
  GraduationCap,
  BookOpen,
  Plus,
  Pencil,
  Trash2,
  X,
  Search,
  Check,
  LucideIcon,
} from "lucide-react";
import {
  TabKey,
  AppData,
  seedData,
  EditingState,
  CATEGORIES,
  Landmark,
  Faculty,
  Department,
  Category,
} from "../admin/admin-dashboard-data";

const STORAGE_KEY = "lasu-admin-data-v1";

const TABS: { key: TabKey; label: string; icon: LucideIcon }[] = [
  { key: "landmarks", label: "Landmarks", icon: MapPin },
  { key: "faculties", label: "Faculties", icon: GraduationCap },
  { key: "departments", label: "Departments", icon: BookOpen },
];

function useSeededStorage() {
  const [data, setData] = useState<AppData>(seedData);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const result = await window.storage.get(STORAGE_KEY, false);
        if (result && result.value) {
          setData(JSON.parse(result.value) as AppData);
        }
      } catch (e) {
        // no saved data yet, keep seed
      } finally {
        setLoaded(true);
      }
    })();
  }, []);

  const persist = async (next: AppData) => {
    setData(next);
    try {
      await window.storage.set(STORAGE_KEY, JSON.stringify(next), false);
    } catch (e) {
      // fail silently for demo purposes
    }
  };

  return { data, persist, loaded };
}

interface FieldProps {
  label: string;
  children: ReactNode;
}

function Field({ label, children }: FieldProps) {
  return (
    <label className="admin-field">
      <span className="admin-field-label">{label}</span>
      {children}
    </label>
  );
}

interface EmptyStateProps {
  label: string;
  onAdd: () => void;
}

function EmptyState({ label, onAdd }: EmptyStateProps) {
  return (
    <div className="admin-empty">
      <div className="admin-empty-badge">Nothing here yet</div>
      <p>
        No {label.toLowerCase()} on record. Add the first one to get the map
        started.
      </p>
      <button className="admin-btn-primary" onClick={onAdd}>
        <Plus size={16} /> Add {label.slice(0, -1)}
      </button>
    </div>
  );
}

export default function AdminDashboard() {
  const { data, persist, loaded } = useSeededStorage();
  const [activeTab, setActiveTab] = useState<TabKey>("landmarks");
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<EditingState | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2200);
    return () => clearTimeout(t);
  }, [toast]);

  const list = data[activeTab];
  const filtered = useMemo(() => {
    if (!query.trim()) return list;
    const q = query.toLowerCase();
    return list.filter((item) => item.name.toLowerCase().includes(q));
  }, [list, query]);

  const facultyName = (id: string) =>
    data.faculties.find((f) => f.id === id)?.name || "Unassigned";

  const openNew = () => {
    if (activeTab === "landmarks") {
      setEditing({
        mode: "new",
        tab: "landmarks",
        item: {
          name: "",
          category: CATEGORIES[0],
          lat: "",
          lng: "",
          description: "",
        },
      });
    } else if (activeTab === "faculties") {
      setEditing({
        mode: "new",
        tab: "faculties",
        item: { name: "", code: "" },
      });
    } else {
      setEditing({
        mode: "new",
        tab: "departments",
        item: { name: "", facultyId: data.faculties[0]?.id || "" },
      });
    }
  };

  const openEdit = (item: Landmark | Faculty | Department) => {
    if (activeTab === "landmarks") {
      setEditing({
        mode: "edit",
        tab: "landmarks",
        item: { ...(item as Landmark) },
      });
    } else if (activeTab === "faculties") {
      setEditing({
        mode: "edit",
        tab: "faculties",
        item: { ...(item as Faculty) },
      });
    } else {
      setEditing({
        mode: "edit",
        tab: "departments",
        item: { ...(item as Department) },
      });
    }
  };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    if (!editing) return;

    const next: AppData = { ...data };

    if (editing.tab === "landmarks") {
      if (editing.mode === "new") {
        const id = `l${Date.now()}`;
        next.landmarks = [
          ...next.landmarks,
          { ...(editing.item as Omit<Landmark, "id">), id },
        ];
      } else {
        const item = editing.item as Landmark;
        next.landmarks = next.landmarks.map((i) =>
          i.id === item.id ? item : i,
        );
      }
    } else if (editing.tab === "faculties") {
      if (editing.mode === "new") {
        const id = `f${Date.now()}`;
        next.faculties = [
          ...next.faculties,
          { ...(editing.item as Omit<Faculty, "id">), id },
        ];
      } else {
        const item = editing.item as Faculty;
        next.faculties = next.faculties.map((i) =>
          i.id === item.id ? item : i,
        );
      }
    } else {
      if (editing.mode === "new") {
        const id = `d${Date.now()}`;
        next.departments = [
          ...next.departments,
          { ...(editing.item as Omit<Department, "id">), id },
        ];
      } else {
        const item = editing.item as Department;
        next.departments = next.departments.map((i) =>
          i.id === item.id ? item : i,
        );
      }
    }

    await persist(next);
    setToast(editing.mode === "new" ? "Added" : "Saved");
    setEditing(null);
  };

  const handleDelete = async (id: string) => {
    const next: AppData = {
      ...data,
      [activeTab]: (data[activeTab] as { id: string }[]).filter(
        (i) => i.id !== id,
      ),
    } as AppData;
    await persist(next);
    setDeleting(null);
    setToast("Deleted");
  };

  const counts: Record<TabKey, number> = {
    landmarks: data.landmarks.length,
    faculties: data.faculties.length,
    departments: data.departments.length,
  };

  const activeLabel = TABS.find((t) => t.key === activeTab)!.label;

  return (
    <div className="admin-app">
      <header className="admin-topbar">
        <div className="admin-brand">
          <div className="admin-crest">LN</div>
          <div>
            <div className="admin-brand-title">LASU Navigator</div>
            <div className="admin-brand-sub">Admin</div>
          </div>
        </div>
        <div className="admin-user-pill">Signed in · Admin</div>
      </header>

      <div className="admin-shell">
        <nav className="admin-tabs">
          {TABS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              className={`admin-tab ${activeTab === key ? "admin-tab-active" : ""}`}
              onClick={() => {
                setActiveTab(key);
                setQuery("");
              }}
            >
              <Icon size={17} />
              <span>{label}</span>
              <span className="admin-tab-count">{counts[key]}</span>
            </button>
          ))}
        </nav>

        <main className="admin-content">
          <div className="admin-content-header">
            <div>
              <h1>{activeLabel}</h1>
              <p className="admin-content-sub">
                {counts[activeTab]} record{counts[activeTab] === 1 ? "" : "s"}{" "}
                on the live map
              </p>
            </div>
            <div className="admin-content-actions">
              <div className="admin-search">
                <Search size={15} />
                <input
                  placeholder={`Search ${activeTab}...`}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
              <button className="admin-btn-primary" onClick={openNew}>
                <Plus size={16} />
                Add {activeLabel.slice(0, -1)}
              </button>
            </div>
          </div>

          {!loaded ? (
            <div className="admin-loading">Loading records…</div>
          ) : filtered.length === 0 ? (
            query ? (
              <div className="admin-no-results">No matches for "{query}"</div>
            ) : (
              <EmptyState label={activeLabel} onAdd={openNew} />
            )
          ) : (
            <div className="admin-table">
              <div className="admin-table-head">
                <span>Name</span>
                {activeTab === "landmarks" && (
                  <>
                    <span>Category</span>
                    <span>Coordinates</span>
                  </>
                )}
                {activeTab === "faculties" && <span>Code</span>}
                {activeTab === "departments" && <span>Faculty</span>}
                <span className="admin-actions-head">Actions</span>
              </div>
              {filtered.map((item) => (
                <div className="admin-table-row" key={item.id}>
                  <span className="admin-row-name">{item.name}</span>
                  {activeTab === "landmarks" && (
                    <>
                      <span>
                        <span className="admin-chip">
                          {(item as Landmark).category}
                        </span>
                      </span>
                      <span className="admin-mono">
                        {(item as Landmark).lat}, {(item as Landmark).lng}
                      </span>
                    </>
                  )}
                  {activeTab === "faculties" && (
                    <span className="admin-mono">{(item as Faculty).code}</span>
                  )}
                  {activeTab === "departments" && (
                    <span>{facultyName((item as Department).facultyId)}</span>
                  )}
                  <span className="admin-row-actions">
                    <button
                      className="admin-icon-btn"
                      onClick={() => openEdit(item)}
                      aria-label="Edit"
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      className="admin-icon-btn admin-icon-btn-danger"
                      onClick={() => setDeleting(item.id)}
                      aria-label="Delete"
                    >
                      <Trash2 size={15} />
                    </button>
                  </span>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {editing && (
        <div className="admin-overlay" onClick={() => setEditing(null)}>
          <div className="admin-panel" onClick={(e) => e.stopPropagation()}>
            <div className="admin-panel-head">
              <h2>
                {editing.mode === "new" ? "Add" : "Edit"}{" "}
                {activeLabel.slice(0, -1)}
              </h2>
              <button
                className="admin-icon-btn"
                onClick={() => setEditing(null)}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSave}>
              <Field label="Name">
                <input
                  required
                  value={editing.item.name}
                  onChange={(e) =>
                    setEditing({
                      ...editing,
                      item: { ...editing.item, name: e.target.value },
                    } as EditingState)
                  }
                  placeholder="e.g. Faculty of Engineering"
                />
              </Field>

              {editing.tab === "landmarks" && (
                <>
                  <Field label="Category">
                    <select
                      value={editing.item.category}
                      onChange={(e) =>
                        setEditing({
                          ...editing,
                          item: {
                            ...editing.item,
                            category: e.target.value as Category,
                          },
                        })
                      }
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <div className="admin-field-row">
                    <Field label="Latitude">
                      <input
                        required
                        value={editing.item.lat}
                        onChange={(e) =>
                          setEditing({
                            ...editing,
                            item: { ...editing.item, lat: e.target.value },
                          })
                        }
                        placeholder="6.4645"
                      />
                    </Field>
                    <Field label="Longitude">
                      <input
                        required
                        value={editing.item.lng}
                        onChange={(e) =>
                          setEditing({
                            ...editing,
                            item: { ...editing.item, lng: e.target.value },
                          })
                        }
                        placeholder="3.1975"
                      />
                    </Field>
                  </div>
                  <Field label="Description">
                    <textarea
                      rows={3}
                      value={editing.item.description}
                      onChange={(e) =>
                        setEditing({
                          ...editing,
                          item: {
                            ...editing.item,
                            description: e.target.value,
                          },
                        })
                      }
                      placeholder="Short note shown when students tap this pin"
                    />
                  </Field>
                </>
              )}

              {editing.tab === "faculties" && (
                <Field label="Short code">
                  <input
                    required
                    value={editing.item.code}
                    onChange={(e) =>
                      setEditing({
                        ...editing,
                        item: { ...editing.item, code: e.target.value },
                      })
                    }
                    placeholder="e.g. ENG"
                  />
                </Field>
              )}

              {editing.tab === "departments" && (
                <Field label="Faculty">
                  <select
                    value={editing.item.facultyId}
                    onChange={(e) =>
                      setEditing({
                        ...editing,
                        item: { ...editing.item, facultyId: e.target.value },
                      })
                    }
                  >
                    {data.faculties.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.name}
                      </option>
                    ))}
                  </select>
                </Field>
              )}

              <div className="admin-panel-footer">
                <button
                  type="button"
                  className="admin-btn-ghost"
                  onClick={() => setEditing(null)}
                >
                  Cancel
                </button>
                <button type="submit" className="admin-btn-primary">
                  <Check size={16} />
                  {editing.mode === "new" ? "Add" : "Save changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleting && (
        <div className="admin-overlay" onClick={() => setDeleting(null)}>
          <div className="admin-confirm" onClick={(e) => e.stopPropagation()}>
            <h3>Delete this record?</h3>
            <p>
              This removes it from the live map immediately. This can't be
              undone.
            </p>
            <div className="admin-panel-footer">
              <button
                className="admin-btn-ghost"
                onClick={() => setDeleting(null)}
              >
                Keep it
              </button>
              <button
                className="admin-btn-danger"
                onClick={() => handleDelete(deleting)}
              >
                <Trash2 size={15} /> Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && <div className="admin-toast">{toast}</div>}
    </div>
  );
}

declare global {
  interface Window {
    storage: {
      get: (
        key: string,
        shared?: boolean,
      ) => Promise<{ key: string; value: string; shared: boolean } | null>;
      set: (
        key: string,
        value: string,
        shared?: boolean,
      ) => Promise<{ key: string; value: string; shared: boolean } | null>;
      delete: (
        key: string,
        shared?: boolean,
      ) => Promise<{ key: string; deleted: boolean; shared: boolean } | null>;
      list: (
        prefix?: string,
        shared?: boolean,
      ) => Promise<{ keys: string[]; prefix?: string; shared: boolean } | null>;
    };
  }
}
