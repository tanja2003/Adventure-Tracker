import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";


export default function BackButton() {
  const navigate = useNavigate();

  return (
    <button
  onClick={() => navigate(-1)}
  style={{ marginRight:"20px", blockSize:"50px"}}
  className="flex items-center px-3 py-1 bg-gray-100 hover:bg-gray-200  font-bold rounded-lg shadow"
>
  ← 
</button>

  );
}

