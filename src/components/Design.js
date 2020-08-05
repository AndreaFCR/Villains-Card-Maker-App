import React, { useState, useEffect } from "react";
import Header from "./HeaderFooter/Header";
import Collapsible from "./Collapsible";
import Preview from "./cardPreview/Preview";
import Palletes from "./colorPalletes/Palletes.js";
import Fill from "./FillComponents/Fill";
import ShareContent from "./shareComponents/ShareContent";
import Footer from "./HeaderFooter/Footer";
import defaultImage from "./defaultImage";

// sass
import "../stylesheets/pages/design.scss";
// import { checkPropTypes } from "prop-types";

let userData = {
  photo: defaultImage,
};
const openOutside = "_blank";

function Design() {
  const [data, setData] = useState(
    JSON.parse(localStorage.getItem("myValueLocalStorage")) || userData
  );
  //const [loading, setLoading] = useState(false);
  const [isAvatarDefault, setIsAvatarDefault] = useState(true);
  const [cardURL, setCardURL] = useState("");
  const [twitterLink, settwitterLink] = useState(
    "https://twitter.com/intent/tweet"
  );

  useEffect(() => {
    //setLoading(true);
    localStorage.setItem("myValueLocalStorage", JSON.stringify(data));
    //setLoading(false);
  });

  const handleInputsValue = (inputInfo) => {
    // console.log(inputInfo);

    setData({
      /* name: data.name,
      job: data.job,
      email: data.email,
      linkedin: data.linkedin,
      github: data.github,
      phone: data.phone, */
      ...data,
      [inputInfo.attr]: inputInfo.value,
    });
  };

  const updateAvatar = (img) => {
    setData({ ...data, photo: img });
    setIsAvatarDefault(false);
  };

  const resetUserData = () => {
    setData({});
  };

  /*const handlePalleteValue = (ev) => {
    console.log('paleta', ev);
  };*/
  // console.log(userData, data, userData === data);

  const showURL = (result) => {
    if (result.success === true) {
      setCardURL(result.cardURL);
      settwitterLink(
        `https://twitter.com/intent/tweet?text=Tu%20tarjeta%20es:%20${result.cardURL}`
      );
    } else {
      setCardURL("¡Vaya! Ha habido un error");
    }
  };

  const SendData = (ev) => {
    ev.preventDefault();
    return fetch(
      "https://us-central1-awesome-cards-cf6f0.cloudfunctions.net/card/",
      {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "content-type": "application/json",
        },
      }
    )
      .then((resp) => {
        return resp.json();
      })
      .then((result) => {
        showURL(result);
      })
      .catch((error) => {
        console.log("ERROR", error);
      });
  };

  return (
    <div>
      <Header />
      <main className="design__container">
        <Preview data={data} reset={resetUserData} openOutside={openOutside} />
        <section>
          <form className="form">
            <fieldset className="form__design collapsable--open">
              <Collapsible
                name="Diseña"
                icon="far fa-object-ungroup"
                iconCollapse="fas fa-chevron-down"
              />
              <Palletes
                selectedPallete={data.pallete}
                inputValue={handleInputsValue}
              />
            </fieldset>
            <fieldset className="form__fill collapsable--open">
              <Collapsible
                name="Rellena"
                icon="far fa-keyboard"
                iconCollapse="fas fa-chevron-down"
              />
              <Fill
                inputValue={handleInputsValue}
                data={data}
                avatar={data.photo}
                isAvatarDefault={isAvatarDefault}
                updateAvatar={updateAvatar}
              />
              {/* <p>
                {loading === true ? "Cargando..." : "Mostrando tus datos..."}
              </p> */}
            </fieldset>

            <fieldset className="form__share collapsable--open">
              <Collapsible
                name="Comparte"
                icon="fas fa-share-alt"
                iconCollapse="fas fa-chevron-down"
              />
              <ShareContent
                iconTwitter="fab fa-twitter"
                SendData={SendData}
                cardURL={cardURL}
                twitterLink={twitterLink}
                openOutside={openOutside}
              />
            </fieldset>
          </form>
        </section>
      </main>
      <Footer openOutside={openOutside} />
    </div>
  );
}

export default Design;
