import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";


export default function BackButton() {
  const navigate = useNavigate();

  return (
    <Button
  onClick={() => navigate(-1)}
  style={{width:"40px", margin:"30px", blockSize:"38px"}}
  type="button"  variant="outline-primary" className="w-full">
    ← 
</Button>

  );
}

