import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getCV, /*addSection*/ } from '../api/gateway';
import {
  updateSection, removeSection, renameCV, changeTemplate, undoCV, } from '../api/gateway';

function CVDetail() {
  const { id } = useParams();
  const [cv, setCv] = useState<any>(null);
  // const [sectionContent, setSectionContent] = useState('');
  const token = localStorage.getItem('token') || '';
  const [editTitle, setEditTitle] = useState('');
  const [template, setTemplate] = useState('classic');

  useEffect(() => {
    if (id) getCV(id, token).then(setCv);
  }, [id]);

  // const handleAddSection = async () => {
  //   if (id && sectionContent) {
  //     await addSection(id, { content: sectionContent }, token);
  //     const updated = await getCV(id, token);
  //     setCv(updated);
  //     setSectionContent('');
  //   }
  // };

  // Rename CV
const handleRename = async () => {
  if (id && editTitle) {
    await renameCV(id, editTitle, token);
    const updated = await getCV(id, token);
    setCv(updated);
  }
};

// Change template
const handleTemplateChange = async () => {
  if (id && template) {
    await changeTemplate(id, template, token);
    const updated = await getCV(id, token);
    setCv(updated);
  }
};

// Undo
const handleUndo = async () => {
  if (id) {
    await undoCV(id, token);
    const updated = await getCV(id, token);
    setCv(updated);
  }
};

  return (
    <div>
      <h2>{cv?.title}</h2>
      <h3>Rename CV</h3>
      <input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
      <button onClick={handleRename}>Rename</button>

      <h3>Change Template</h3>
      <select value={template} onChange={(e) => setTemplate(e.target.value)}>
        <option value="classic">Classic</option>
        <option value="modern">Modern</option>
      </select>
      <button onClick={handleTemplateChange}>Apply</button>

      <h3>Undo</h3>
      <button onClick={handleUndo}>Undo</button>

      <ul>
        {cv?.sections?.map((s: any, idx: number) => (
          <li key={idx}>
            <textarea
              value={s.content}
              onChange={(e) => {
                const updated = { ...s, content: e.target.value };
                setCv({
                  ...cv,
                  sections: cv.sections.map((sec: any, i: number) => (i === idx ? updated : sec)),
                });
              }}
            />
            <button onClick={() => updateSection(id!, s, token)}>Update</button>
            <button onClick={() => removeSection(id!, s.id, token)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CVDetail;
