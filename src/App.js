import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { connect } from "./redux/blockchain/blockchainActions";
import { fetchData } from "./redux/data/dataActions";
import * as s from "./styles/globalStyles";
import styled from "styled-components";
import i1 from "./assets/images/RK_homepage_gif.png";
import i2 from "./assets/images/RetroKydz_logo_white.png";

export const StyledButton = styled.button`
  padding: 10px;
  border-radius: 50px;
  border: none;
  background-color: #ffffff;
  padding: 10px;
  font-weight: bold;
  color: #000000;
  width: 300px;
  cursor: pointer;
  box-shadow: 2px 8px 4px -2px rgba(250, 250, 0, 0.5);
  -webkit-box-shadow: 2px 3px 10px -2px rgba(250, 250, 0, 0.5);
  -moz-box-shadow: 2px 8px 4px -2px rgba(250, 250, 0, 0.5);
  :active {
    box-shadow: none;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
  }
  :hover {
    -webkit-box-shadow: 2px 3px 40px -2px rgba(250, 250, 0, 0.9);
  }
`;

export const ResponsiveWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: stretched;
  align-items: stretched;
  width: 100%;
  @media (min-width: 767px) {
    flex-direction: column;
  }
`;

export const StyledImg = styled.img`
  width: 200px;
  height: 200px;
  @media (min-width: 767px) {
    width: 300px;
    height: 300px;
  }
  transition: width 0.5s;
  transition: height 0.5s;
`;

function App() {
  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
  const data = useSelector((state) => state.data);
  const [feedback, setFeedback] = useState("What Personality will your Retro Kydz have?");
  const [claimingNft, setClaimingNft] = useState(false);

  const claimNFTs = (_amount) => {
    if (_amount <= 0) {
      return;
    }
    setFeedback("Preparing your Retro Kydz NFT for adoption...");
    setClaimingNft(true);
    blockchain.smartContract.methods
      .mint(blockchain.account, _amount)
      .send({
        gasLimit: "285000",
        to: "0x263779599e8FF700e744b953cA16C5bC9F1e80CA",
        from: blockchain.account,
        value: blockchain.web3.utils.toWei((.02 * _amount).toString(), "ether"),
      })
      .once("error", (err) => {
        console.log(err);
        setFeedback("It seems the transaction was cancelled.");
        setClaimingNft(false);
      })
      .then((receipt) => {
        setFeedback(
          "Woohoo! You just helped save a Retro Kyd!"
        );
        setClaimingNft(false);
        dispatch(fetchData(blockchain.account));
      });
  };

  const getData = () => {
    if (blockchain.account !== "" && blockchain.smartContract !== null) {
      dispatch(fetchData(blockchain.account));
    }
  };

  useEffect(() => {
    getData();
  }, [blockchain.account]);

  return (
    <s.Screen style={{ backgroundColor: "#000000" }}>
      <s.Container flex={1} ai={"center"} style={{ padding: 12 }}>
        <s.TextTitle
          style={{ textAlign: "center", fontSize: 36, fontWeight: "bold", fontColor: "ffffff" }}
        >
          The Retro Kydz NFT Collection
        </s.TextTitle>
        <s.TextTitle
              style={{ textAlign: "center", fontSize: 16, fontWeight: "bold" }}
            >
            Adopt one (or 5) today. They all need new homes!
         </s.TextTitle>


        <s.SpacerMedium />
        <ResponsiveWrapper flex={1} style={{ padding: 12 }}>
              <s.TextTitle
              style={{ textAlign: "center", fontSize: 22, fontWeight: "bold" }}
            >
              {data.totalSupply} of 4,000 have been minted
            </s.TextTitle>        
          <s.Container flex={1} jc={"center"} ai={"center"}>

            <StyledImg alt={"example"} src={i1} />
                        <s.SpacerMedium />
                     <s.SpacerMedium />
                {blockchain.account === "" ||
                blockchain.smartContract === null ? (
                  <s.Container ai={"center"} jc={"center"}>
                    <s.TextDescription style={{ textAlign: "center" }}>
                    
                    </s.TextDescription>
                    <s.SpacerSmall />
                    <StyledButton
                      onClick={(e) => {
                        e.preventDefault();
                        dispatch(connect());
                        getData();
                      }}
                    >
                      CONNECT WALLET
                    </StyledButton>
                    {blockchain.errorMsg !== "" ? (
                      <>
                        <s.SpacerSmall />
                        <s.TextDescription style={{ textAlign: "center" }}>
                          {blockchain.errorMsg}
                        </s.TextDescription>
                      </>
                    ) : null}
                  </s.Container>
                ) : (
                  <s.Container ai={"center"} jc={"center"} fd={"row"}>
                    <StyledButton
                      disabled={claimingNft ? 1 : 0}
                      onClick={(e) => {
                        e.preventDefault();
                        claimNFTs(1);
                        getData();
                      }}
                    >
                      {claimingNft ? "Busy..." : "Buy 1 NFT"}
                    </StyledButton>
                  </s.Container>
                )}
             
             <s.TextTitle
              style={{ textAlign: "center", fontSize: 14, fontWeight: "bold" }}
            >
            1 Retro Kidz NFT costs .05 ETH (+ gas)
         </s.TextTitle>
            <StyledImg alt={"example"} src={i2} />

          </s.Container>
 
          <s.SpacerMedium />
          <s.Container
            flex={1}
            jc={"center"}
            ai={"center"}
            style={{ backgroundColor: "#000000", padding: 12 }}
          >
            {Number(data.totalSupply) == 10000 ? (
              <>
                <s.TextTitle style={{ textAlign: "center" }}>
                  The sale has ended.
                </s.TextTitle>
                <s.SpacerSmall />
                <s.TextDescription style={{ textAlign: "center" }}>
                  You can still buy and trade Retro Kydz NFTs on{" "}
                  <a
                    target={""}
                    href={"https://opensea.io/collection/retrokydz"}
                  >
                    Opensea.io
                  </a>
                </s.TextDescription>
              </>
            ) : (
              <>

              </>
            )}
          </s.Container>
                <s.SpacerLarge />
                <s.SpacerSmall />
                <s.TextDescription style={{ textAlign: "center" }}>
                  {feedback}
                </s.TextDescription>
        </ResponsiveWrapper>
        <s.SpacerSmall />
        <s.Container jc={"center"} ai={"center"} style={{ width: "70%" }}>
          <s.SpacerSmall />
          <s.TextTitle
              style={{ textAlign: "center", fontSize: 16, fontWeight: "bold" }}
            >
           
             <a target={"_blank"}
                href={"https://retrokydz.io"}
              >
                 Home 
             </a> | 
             <a target={"_blank"}
                href={"https://discord.gg/F27J7ytE"}
              >
                  Discord 
             </a> | 
             <a target={"_blank"}
                href={"TWITTER"}
              >
                 <br/> Twitter
             </a>
          </s.TextTitle>
        </s.Container>
      </s.Container>
    </s.Screen>
  );
}

export default App;
