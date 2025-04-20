import Link from "next/link";

export default function LearnAIPage() {
  const learningModes = [
    {
      slug: "flashcards",
      title: "Flashcards",
      description: "Learn and revise with AI-generated flashcards.",
      icon: "📇",
    },
    {
      slug: "socratic-questioning",
      title: "Socratic Questioning",
      description: "Deepen understanding through guided Q&A.",
      icon: "❓",
    },
    {
      slug: "story-based-learning",
      title: "Story-Based Learning",
      description: "Absorb concepts through AI-generated stories.",
      icon: "📖",
    },
    {
      slug: "cloze-test",
      title: "Cloze Test",
      description: "Practice by filling in the blanks.",
      icon: "📝",
    },
    {
      slug: "dialogic-mode",
      title: "Dialogic Mode",
      description: "Engage in a conversation to learn interactively.",
      icon: "💬",
    },
    {
      slug: "visual-learning",
      title: "Visual Learning",
      description: "Grasp concepts with AI-generated diagrams & visuals.",
      icon: "🖼️",
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-background">
      <h1 className="text-4xl font-bold mb-4 text-center">Learn with AI</h1>
      <p className="text-lg text-muted-foreground mb-8 text-center max-w-xl">
        Choose a learning mode below. Each mode offers a unique, AI-powered learning experience!
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-5xl">
        {learningModes.map((mode) => (
          <Link
            href={`/learn-ai/${mode.slug}`}
            key={mode.slug}
            className="flex flex-col items-center justify-center bg-card rounded-xl shadow-lg p-8 transition-transform hover:scale-105 cursor-pointer border border-border min-h-[200px]"
          >
            <div className="text-5xl mb-4">{mode.icon}</div>
            <h2 className="text-2xl font-semibold mb-2 text-center">{mode.title}</h2>
            <p className="text-base text-muted-foreground text-center">{mode.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
