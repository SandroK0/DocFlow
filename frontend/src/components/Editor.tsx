import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

export default function Editor(props: any) {
  // Custom modules configuration
  const modules = {
    toolbar: [
      [{ header: "1" }, { header: "2" }, { font: [] }],
      [{ list: "ordered" }, { list: "bullet" }],
      ["bold", "italic", "underline"],
      ["link"],
      [{ align: [] }],
      ["code-block"],
    ],
  };

  const editorStyles = {
    width: "900px",
    height: "800px",
  };

  return (
    <ReactQuill
      theme="snow"
      value={props.value}
      onChange={props.handleChange}
      style={editorStyles}
      modules={modules} // Pass the modules here
    />
  );
}
