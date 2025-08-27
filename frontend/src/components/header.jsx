import retrackLogo from "../assets/Retrack.png";
export default function Header() {
  return (
    <div className="d-flex justify-content-between mh-25 bg-white">
      <div>
        <img src={retrackLogo} alt="" className="img-fluid w-25" />
      </div>

      <div className="mt-5 mx-5">
        <h2 style={{ color: "darkblue", fontFamily: "arial" , fontSize:"bold" }}>
          Re<span style={{color:"orangered"}}>Tra</span><span style={{color:"yellow"}}>ck</span>
          <h2 style={{color:"orangered"}}>Inv<span style={{color:"darkblue"}}>ent</span><span style={{color:"yellow"}}>ory</span></h2>
        </h2>
      </div>
    </div>
  );
}
