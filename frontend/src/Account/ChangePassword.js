import BackButton from "../Design/BackButton";


export default function ChangePassword(){
    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50">
            <div className="bg-gray-400 p-8 rounded-lg w-full max-w-md shadow-lg" 
                style={{ fontSize:"22px", padding:"80px", 
                    marginLeft:"35%", position:"relative", 
                    marginRight:"35%", marginTop:"3%"}}>
                <h1 className="text-2xl font-bold text-center text-gray-500 mb-4" style={{marginTop:"-30px"}}>Passwort ändern</h1>
                <BackButton />  
                <div className="flex flex-col space-y-1">
                    <label htmlFor="name-" style={{marginRight:"75px"}}>Name:</label>
                    <input type="text"
                            id="name-register"
                            name="name-register"
                            placeholder="Max Mustermann"
                            onChange={null}
                            aria-invalid="false"
                            ></input>
                </div>
            </div> 
        </div>
    )
};