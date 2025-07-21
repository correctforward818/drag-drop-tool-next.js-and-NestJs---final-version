import { useSelector, useDispatch } from "react-redux";
import type { TypedUseSelectorHook } from "react-redux";
import type { RootState, AppDispatch } from "../store";
import {
  setTemplate,
  setSelectedElement,
  updateRow,
  addContent,
  updateContent,
  deleteContent,
  insertRow,
  setIsDragging,
  setDragElementType,
} from "../store/slices/builderSlice";
import type { Template, Row, Content, ElementType, ContentValues } from "../types/template";

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const useBuilder = () => {
  const dispatch = useAppDispatch();
  const { template, selectedElement, isDragging, dragElementType } =
    useAppSelector((state) => state.builder);

  return {
    template,
    selectedElement,
    isDragging,
    dragElementType,

    // Actions wrapped with dispatch
    setTemplate: (template: Template) => dispatch(setTemplate(template)),

    setSelectedElement: (element: { id: string; type: ElementType } | null) =>
      dispatch(setSelectedElement(element)),

    insertRow: (index: number) => dispatch(insertRow(index)),

    updateRow: (rowId: string, updates: Partial<Row>) =>
      dispatch(updateRow({ rowId, updates })),

    addContent: (columnId: string, content: Content, index: number) =>
      dispatch(addContent({ columnId, content, index })),

    updateContent: (contentId: string, updates: Partial<ContentValues>) =>
      dispatch(updateContent({ contentId, updates })),

    deleteContent: (contentId: string) => dispatch(deleteContent(contentId)),

    setIsDragging: (isDragging: boolean) => dispatch(setIsDragging(isDragging)),

    setDragElementType: (dragElementType: ElementType | null) =>
      dispatch(setDragElementType(dragElementType)),
  };
};
