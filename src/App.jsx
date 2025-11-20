// main.jsx

import './Styles/App.css';
import "./Styles/AppStyles.css";
import "./Styles/Card.css";
import { useState, useEffect } from "react";
import RenderListAndDict from "./Render/RenderListAndDict";
import { handleButtonClick as runButtonFeature } from "./AppFeatures/handleButtonClick";
import CardButtons from "./Render/Buttons";
import VideoBackground from "./VideoBackground";


function App() {
  const [cardpacks, setCardpacks] = useState([]);
  const [rollResult, setRollResult] = useState(null);
  const [activeCard, setActiveCard] = useState(null); // quản lý card đang click
  const [hoveredCard, setHoveredCard] = useState(null); // card hover
  const [playVideo, setPlayVideo] = useState(false);
  const [videoEnded, setVideoEnded] = useState(false);
  const [hideContent, setHideContent] = useState("show");
  const [SelectedDeck, setSelectedDeck] = useState(null);
  const [HoveringEffect, setHoveringEffect] = useState("Change");
  const [totalDict, setTotalDict] = useState({}); // lưu trữ cộng dồn các dict


  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    fetch(`${backendUrl}/get-string`)
      .then((res) => res.json())
      .then((data) => setCardpacks(data))
      .catch((err) => console.error(err));
  }, []);

  
  const handleCardClick = (index) => {
    setActiveCard(activeCard === index ? null : index); 
    setHoveringEffect(activeCard === index ? null : index);
    // click lại card đang active sẽ đóng nút
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.card')) {
        setActiveCard(null);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);
  // console.log(cardpacks);
  // console.log(backendUrl);
  return (
    <div>
      <div className="full-background">
        {/* TotalDict chỉ hiển thị khi hover card */}
        {hoveredCard !== null && (
          <div className="total-dict">
            <div className="total-dict-list">
              {Object.entries(totalDict).length === 0 && <div>Empty</div>}
              {Object.entries(totalDict)
                .sort(([keyA, valA], [keyB, valB]) => valB - valA)
                .map(([key, value]) => (
                  <div key={key} className="total-dict-item">
                    <strong>{key}:</strong> {value}
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
      <div>
        {/* Bọc h1 + cards-container vào div này */}
        <div 
          className={`main-content ${hideContent}`} 
          style={hideContent === "hide" ? { "--cardpack-effect": SelectedDeck. Effect } : {}}
        >
          <div
            style={{
              fontSize: "4em",
              color: "#fff700",
              WebkitTextStroke: "2px #0000ff", // chú ý chữ hoa W
              fontWeight: "bold",
              textAlign: "center", // thay cho align="center"
            }}
          >
            River of Cards
          </div>

          <div className="cards-container">
            {cardpacks.map((card, index) => (
              <div 
                className="card" key={index} 
                onClick={() => handleCardClick(index)}
                onMouseEnter={() => {
                  setHoveredCard(index);
                  setHoveringEffect(activeCard === index ? index : "Beetle");
                }}
                onMouseLeave={() => {
                  setHoveredCard(null);
                  setHoveringEffect("Beetle")
                }}
              >
                <div className="card-img-wrapper">
                  <img 
                    src={`${(card.Cover === ""
                        ? "/Packs/BETA/Default.jpg" // Nếu Animation rỗng, dùng ảnh Default (ƯU TIÊN 1)
                        : (HoveringEffect === index ? card.Animation : card.Cover) // Ngược lại, kiểm tra hover/cover
                    ).replace(/ /g, "%20")}`}
                    alt={card.Title} 
                  />
                </div>
                <div className="card-body">
                  <div className="card-title">{card.Title}</div>
                    <div className="card-footer">
                      <div className="card-note"
                        style={{ 
                          '--note-color': (activeCard === index || hoveredCard === index || hideContent == "hide")? 'transparent' : '#ccc' 
                        }}
                      ><i>{card.Note}</i></div>
                      {(activeCard === index || hoveredCard === index) && (
                        <div className="button-row">
                          <CardButtons
                            times={card.Cards}
                            unpackList={card.Unpack}
                            button_trim={card.Button.replace(/ /g, "%20")} 
                            guarantee={card.Guarantee}
                            onRoll={(result) => {
                              setSelectedDeck(card);
                              setRollResult(result);
                              setPlayVideo(true);
                              setVideoEnded(false);
                              setHideContent("hide");
                              setTotalDict(prev => {
                                const newDict = { ...prev }; // copy dict cũ
                                Object.entries(result.dict).forEach(([key, value]) => {
                                  if (newDict[key]) {
                                    newDict[key] += value; // nếu key cũ -> cộng dồn
                                  } else {
                                    newDict[key] = value; // nếu key mới -> gán giá trị
                                  }
                                });
                                return newDict;
                              });
                            }}
                          />
                        </div>
                      )}
                    </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {playVideo && SelectedDeck && (
          <VideoBackground
            onEarlyEnd={() => setVideoEnded(true)} // fade-in sớm hơn
            onEnded={() => {
              setHideContent("show");
              setPlayVideo(false);
            }}    // video kết thúc thật
            IntroVideo= {SelectedDeck.Intro.replace(/ /g, "%20")}
          />
        )}


        {rollResult && videoEnded && (
          <RenderListAndDict
            list={rollResult.list}
            dict={rollResult.dict}
            unpackList={rollResult.list}
            onClose={() => {
              setRollResult(null);
              setHideContent("appear");
            }}
          />
        )}
      </div>
    </div>
  );
}

export default App;