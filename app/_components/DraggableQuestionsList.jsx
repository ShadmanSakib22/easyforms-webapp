"use client";

import { useRef, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Plus } from "lucide-react";
import QuestionItem from "./QuestionItem";
import { useTranslations } from "next-intl";

export default function DraggableQuestionsList({
  questions,
  setQuestions,
  handleQuestionChange,
  handleOptionChange,
  removeQuestion,
  addQuestion,
  addOptionToQuestion,
  removeOptionFromQuestion,
}) {
  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;

    const reorderedQuestions = [...questions];
    const [moved] = reorderedQuestions.splice(source.index, 1);
    reorderedQuestions.splice(destination.index, 0, moved);
    setQuestions(reorderedQuestions);
  };

  const autoScrollRef = useRef(null);
  useEffect(() => {
    if (questions.length && autoScrollRef.current) {
      autoScrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [questions.length]);

  const t = useTranslations("builder");

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="questions-list">
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="space-y-4"
          >
            {questions.map((q, i) => (
              <Draggable key={q.id} draggableId={q.id.toString()} index={i}>
                {(provided, snapshot) => (
                  <QuestionItem
                    q={q}
                    i={i}
                    provided={provided}
                    snapshot={snapshot}
                    handleQuestionChange={handleQuestionChange}
                    handleOptionChange={handleOptionChange}
                    removeQuestion={removeQuestion}
                    addOptionToQuestion={addOptionToQuestion}
                    removeOptionFromQuestion={removeOptionFromQuestion}
                  />
                )}
              </Draggable>
            ))}
            {provided.placeholder}
            <div ref={autoScrollRef} />
            <button
              type="button"
              onClick={addQuestion}
              className="btn btn-primary btn-outline"
            >
              <Plus className="w-4 h-4 mr-1" /> {t("add_question")}
            </button>
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}
