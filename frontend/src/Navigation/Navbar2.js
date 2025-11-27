import { Container, Navbar } from "react-bootstrap";


function Navbar2(){
    return (
        <Navbar bg="dark" data-bs-theme="dark" >
            <Container style={{ marginLeft:"3%"}}>
                 <img style={{blockSize:"80px"}} src={`${process.env.PUBLIC_URL}/logo1.jpg`} alt="Logo" />
                <Navbar.Brand href="#home" style={{fontSize:"35px"}}>
                     Welcome to Adventure Tracker </Navbar.Brand>
            </Container>
        </Navbar>
    )
}

export default Navbar2;