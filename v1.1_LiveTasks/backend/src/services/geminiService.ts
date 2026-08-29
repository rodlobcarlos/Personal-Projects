import { GoogleGenerativeAI } from '@google/generative-ai';
import { config } from '../config';
import { Task } from '../models/Task';

const genAI = new GoogleGenerativeAI(config.geminiApiKey);

const getModel = () => {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  return model;
};

interface TaskSuggestionInput {
  taskTitle: string;
  taskDescription?: string;
  dueDate?: string | null;
  pendingTasksCount: number;
}

interface DaySummaryInput {
  date: string;
  tasks: { title: string; description?: string; status: string; dueDate?: string | null }[];
}

export const getTaskSuggestion = async (input: TaskSuggestionInput): Promise<string> => {
  try {
    const model = getModel();

    const prompt = `
Eres un asistente experto en productividad y gestión del tiempo. Tu objetivo es ayudar a
optimizar el día a día del usuario teniendo en cuenta su carga de tareas.

Actualmente el usuario tiene ${input.pendingTasksCount} tarea(s) pendiente(s).

Tarea sobre la que se solicita consejo:
- Título: ${input.taskTitle}
- Descripción: ${input.taskDescription || 'Sin descripción'}
- Fecha de vencimiento: ${input.dueDate ? new Date(input.dueDate).toLocaleDateString() : 'Sin fecha'}

Genera una sugerencia útil, concreta y motivadora en español (máximo 5 líneas).
Incluye al menos una recomendación práctica de cómo abordar esta tarea junto con el resto
de la carga pendiente, priorizando por urgencia e importancia.
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text().trim();
  } catch (error) {
    return 'No pude generar una sugerencia en este momento. Intenta nuevamente más tarde.';
  }
};

export const getDaySummary = async (input: DaySummaryInput): Promise<string> => {
  try {
    const model = getModel();

    const pending = input.tasks.filter((t) => t.status !== 'completed').length;
    const completed = input.tasks.filter((t) => t.status === 'completed').length;

    const taskLines = input.tasks
      .map(
        (t) =>
          `- ${t.title} (${t.status === 'completed' ? 'Hecha' : t.status === 'in_progress' ? 'En curso' : 'Pendiente'})${
            t.dueDate ? ` - Vence: ${new Date(t.dueDate).toLocaleDateString()}` : ''
          }`
      )
      .join('\n');

    const prompt = `
Eres un asistente de productividad. Genera un resumen personalizado y motivador para el
día ${input.date} para un usuario que gestiona sus tareas.

Resumen de su situación:
- Tareas programadas: ${input.tasks.length}
- Tareas pendientes: ${pending}
- Tareas completadas: ${completed}

${input.tasks.length > 0 ? `Detalle de tareas:\n${taskLines}` : 'No tiene tareas programadas para este día.'}

Entrega el resumen en español, estructurado y optimista (máximo 8 líneas).
Incluye al menos: una frase de motivación, un consejo de productividad y una sugerencia
de priorización si tiene tareas pendientes.
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text().trim();
  } catch (error) {
    return 'No pude generar el resumen en este momento. Intenta nuevamente más tarde.';
  }
};
