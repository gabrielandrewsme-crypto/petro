import { AssistantChat } from "@/components/assistant-chat";
import { SectionHeader } from "@/components/ui";
import { requireUser } from "@/lib/auth";

export default async function AssistenteEspecialistaPage() {
  await requireUser();

  return (
    <>
      <SectionHeader
        title="Assistente especialista"
        description="Chat com contexto do seu plano, aulas da semana e progresso para tirar duvidas de estudo."
      />
      <AssistantChat />
    </>
  );
}
