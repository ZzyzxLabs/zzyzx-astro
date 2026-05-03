import React from "react";
import ProjectTheater, { type Scene } from "./ProjectTheater";
import SeaWalletDiagram from "./diagrams/SeaWalletDiagram";
import NereusDiagram from "./diagrams/NereusDiagram";
import BermuDAODiagram from "./diagrams/BermuDAODiagram";

const seaWalletScenes: [Scene, Scene, Scene] = [
  {
    kind: "image",
    step: "01",
    caption: "Store",
    imageSrc: "/loadingscreen.png",
  },
  {
    kind: "diagram",
    step: "02",
    caption: "Inherit",
    render: (p) => <SeaWalletDiagram progress={p} />,
  },
  {
    kind: "image",
    step: "03",
    caption: "Utilize",
    imageSrc: "/loadingscreen.png",
  },
];

const nereusScenes: [Scene, Scene, Scene] = [
  {
    kind: "image",
    step: "01",
    caption: "Predict",
    imageSrc: "/nereus.png",
  },
  {
    kind: "diagram",
    step: "02",
    caption: "Verify",
    render: (p) => <NereusDiagram progress={p} />,
  },
  {
    kind: "image",
    step: "03",
    caption: "Trust",
    imageSrc: "/nereus.png",
  },
];

const bermuDAOScenes: [Scene, Scene, Scene] = [
  {
    kind: "image",
    step: "01",
    caption: "Learn",
    imageSrc: "/bermuBlackG.png",
  },
  {
    kind: "diagram",
    step: "02",
    caption: "Connect",
    render: (p) => <BermuDAODiagram progress={p} />,
  },
  {
    kind: "image",
    step: "03",
    caption: "Build",
    imageSrc: "/bermuWhiteG.png",
  },
];

export default function Acts() {
  return (
    <div>
      <ProjectTheater
        index='01'
        name='SeaWallet'
        blurb='Store, inherit, and utilize your assets with the most intelligent smart-contract wallet on the Sui network.'
        ctaLabel='Launch App'
        ctaHref='https://example.com'
        ctaPrimary
        scenes={seaWalletScenes}
      />
      <ProjectTheater
        index='02'
        name='Nereus'
        blurb='Sharpen your predictions with LLMs running inside trustable execution environments.'
        ctaLabel='Explore Now'
        ctaHref='https://www.trynereus.xyz/'
        scenes={nereusScenes}
      />
      <ProjectTheater
        index='03'
        name={
          <>
            Bermu<span className='text-primary'>DAO</span>
          </>
        }
        blurb='Learn, connect, and collaborate with one of the most active communities of Web3 developers.'
        ctaLabel='Explore Now'
        ctaHref='https://example.com'
        scenes={bermuDAOScenes}
      />
    </div>
  );
}
