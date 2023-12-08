import React from "react";

const Loading = () =>{

    return (
        <div className="container h-100 d-flex align-items-center justify-content-center " style={{height : "100vh"}}>
            <div className="spinner-border mt-50" style={{ width: "5rem", height: "5rem",marginTop : '280px' }} role="status">
                <span className="sr-only">Loading...</span>
            </div>
        </div>
      );
}

export default Loading