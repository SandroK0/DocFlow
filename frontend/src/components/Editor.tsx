import ReactQuill from "react-quill";
import React, { useEffect, useRef } from "react";
import "react-quill/dist/quill.snow.css";

interface QuillEditorProps {
  value: string;
  handleChange: (content: string) => void;
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    justifyContent: "center",
  },
  headerContainer: {
    position: "fixed" as const,
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: "white",
    borderBottom: "1px solid #e2e8f0",
    boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.10)",
    zIndex: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  toolbarWrapper: {
    maxWidth: "1152px",
    margin: "0 auto",
    padding: "8px 16px",
  },
  toolbar: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap" as const,
  },
  editor: {
    backgroundColor: "white",
    border: "None",
    borderRadius: "8px",
    boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.3)",
    height: "730px",
    width: "800px",
    marginTop: "30px",
    transform: "scale(1.2)",
    padding: "30px",
  },
  formats: {
    display: "inline-flex",
    gap: "5px",
    alignItems: "center",
    padding: "0 5px",
    borderRight: "1px solid #e2e8f0",
  },
};

const headerOptions = [
  { value: "1", label: "Heading 1" },
  { value: "2", label: "Heading 2" },
  { value: "3", label: "Heading 3" },
  { value: "", label: "Normal" },
];

const fontOptions = [
  { value: "", label: "Default" },
  { value: "serif", label: "Serif" },
  { value: "monospace", label: "Monospace" },
  { value: "comic-sans", label: "Comic Sans" },
  { value: "courier-new", label: "Courier New" },
  { value: "georgia", label: "Georgia" },
  { value: "helvetica", label: "Helvetica" },
  { value: "lucida", label: "Lucida" },
];

const QuillEditor: React.FC<QuillEditorProps> = ({ value, handleChange }) => {
  const quillRef = useRef<ReactQuill>(null);

  useEffect(() => {
    const editor = quillRef.current?.editor?.root;
    if (editor) {
      editor.setAttribute("spellcheck", "false");
    }
  }, []);

  const modules = {
    toolbar: {
      container: "#toolbar",
    },
  };


  return (
    <div style={styles.container}>
      <div style={styles.headerContainer}>
        <div style={styles.toolbarWrapper}>
          <div id="toolbar" style={styles.toolbar}>
            <span className="ql-formats" style={styles.formats}>
              <select className="ql-header">
                {headerOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <select className="ql-font">
                {fontOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </span>
            <span className="ql-formats">
              <select className="ql-size"></select>
            </span>
            <span className="ql-formats" style={styles.formats}>
              <button className="ql-bold" />
              <button className="ql-italic" />
              <button className="ql-underline" />
              <button className="ql-strike" />
            </span>
            <span className="ql-formats" style={styles.formats}>
              <select className="ql-color" />
              <select className="ql-background" />
            </span>
            <span className="ql-formats" style={styles.formats}>
              <button className="ql-list" value="ordered" />
              <button className="ql-list" value="bullet" />
              <select className="ql-align" />
            </span>
            <span className="ql-formats" style={styles.formats}>
              <button className="ql-link" />
              <button className="ql-image" />
              <button className="ql-code-block" />
            </span>
          </div>
        </div>
      </div>

      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={value}
        onChange={handleChange}
        modules={modules}
        style={styles.editor}
        placeholder="Write something amazing..."
      />
      <style>
        {`  .ql-toolbar.ql-snow {
          border: none !important;
        }
        .ql-container.ql-snow {
          border: none !important;
        }
        .ql-editor {
        }`}
      </style>
    </div>
  );
};

export default QuillEditor;
