import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/database/db';
import type { DevProject, DevSnippet, DevIdea, ChecklistItem, ProjectStatus } from '@/types';

export function useDevProjects() {
  const projects = useLiveQuery(() => db.devProjects.orderBy('createdAt').reverse().toArray(), [], []);

  async function addProject(params: { name: string; status: ProjectStatus; githubUrl?: string; notes?: string }) {
    const project: DevProject = { id: crypto.randomUUID(), checklist: [], createdAt: new Date().toISOString(), ...params };
    await db.devProjects.add(project);
  }
  async function deleteProject(id: string) {
    await db.devProjects.delete(id);
  }
  async function updateProject(project: DevProject) {
    await db.devProjects.put(project);
  }
  async function addChecklistItem(projectId: string, text: string) {
    const project = await db.devProjects.get(projectId);
    if (!project) return;
    const item: ChecklistItem = { id: crypto.randomUUID(), text, done: false };
    await db.devProjects.put({ ...project, checklist: [...project.checklist, item] });
  }
  async function toggleChecklistItem(projectId: string, itemId: string) {
    const project = await db.devProjects.get(projectId);
    if (!project) return;
    const checklist = project.checklist.map((i) => (i.id === itemId ? { ...i, done: !i.done } : i));
    await db.devProjects.put({ ...project, checklist });
  }

  return { projects: projects ?? [], addProject, deleteProject, updateProject, addChecklistItem, toggleChecklistItem };
}

export function useDevSnippets() {
  const snippets = useLiveQuery(() => db.devSnippets.orderBy('createdAt').reverse().toArray(), [], []);

  async function addSnippet(params: { title: string; language: string; code: string }) {
    const snippet: DevSnippet = { id: crypto.randomUUID(), createdAt: new Date().toISOString(), ...params };
    await db.devSnippets.add(snippet);
  }
  async function deleteSnippet(id: string) {
    await db.devSnippets.delete(id);
  }

  return { snippets: snippets ?? [], addSnippet, deleteSnippet };
}

export function useDevIdeas() {
  const ideas = useLiveQuery(() => db.devIdeas.orderBy('createdAt').reverse().toArray(), [], []);

  async function addIdea(params: { title: string; note?: string }) {
    const idea: DevIdea = { id: crypto.randomUUID(), createdAt: new Date().toISOString(), ...params };
    await db.devIdeas.add(idea);
  }
  async function deleteIdea(id: string) {
    await db.devIdeas.delete(id);
  }

  return { ideas: ideas ?? [], addIdea, deleteIdea };
}
