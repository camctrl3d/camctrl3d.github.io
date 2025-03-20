import * as React from "react";
import { createRoot } from "react-dom/client";
import { Carousel, Crop } from "./video_display";
import styles from "./index.module.scss";

function Ours() { return <><span className={styles.ours}>CamCtrl</span>3D</>; }
function VSpace(props: { rem: number }) { return <div className={styles.vspace} style={{ height: `${props.rem}em` }} />; }
function Section(props: React.PropsWithChildren<{ title?: string, wide?: boolean }>) {
  return <div className={props.wide ? styles.section_wide : styles.section_narrow}>
    {props.title && <div className={styles.section_title}>{props.title}</div>}
    {props.children}
  </div>
}
function Justify(props: React.PropsWithChildren<{}>) {
  return <div className={styles.para_justify}>{props.children}</div>
}
function Center(props: React.PropsWithChildren<{ style?: React.CSSProperties }>) {
  return <div className={styles.para_center} style={props.style}>{props.children}</div>
}

function Link(props: React.PropsWithChildren<{ href: string, icon?: string }>) {
  return <a href={props.href} className={styles.link_item} target="_blank">
    {props.icon && <img src={props.icon} className={styles.link_icon} />}
    {props.children}
  </a>
}


export function LabeledVideo(
  props: { url: string; labels: string[]; visible?: boolean; speed?: number; }
) {
  const [showLoading, setShowLoading] = React.useState(false);
  const videoRef = React.useRef<HTMLVideoElement | null>(null)
  const videoRefFn = React.useCallback((elem: HTMLVideoElement | null) => {
    videoRef.current = elem;
    if (videoRef.current && props.speed && videoRef.current.playbackRate !== props.speed)
      videoRef.current.playbackRate = props.speed;
  }, [videoRef, props.speed])

  React.useEffect(() => {
    let loadStart: number | null = null;
    const inspectVideoState = () => {
      if (videoRef.current && videoRef.current.readyState < 4) { // Loading
        if (loadStart === null) loadStart = Date.now();
        if (Date.now() - loadStart! > 500) setShowLoading(true); // 500ms
      } else {
        loadStart = null;
        setShowLoading(false);
      }
    }
    const intervalId = setInterval(inspectVideoState, 125);
    return () => clearInterval(intervalId);
  }, [setShowLoading]);

  return (
    <div className={styles.labeled_video}
      style={{ gridTemplateColumns: `repeat(${props.labels.length}, 1fr)` }}>
      <div className={styles.video_container}>
        <img src={`${props.url}.thumb.jpg`} className={styles.labeled_video_img} />
        {props.visible && <video autoPlay muted loop playsInline src={props.url} preload="auto" ref={videoRefFn} />}
      </div>
      {props.labels.map((v, i) => <div data-label="t" key={v} style={{ gridColumn: i + 1 }}>{v}</div>)}
      <div data-load-ind="t" style={{ display: showLoading ? "inline" : "none" }}>Loading video ...</div>
    </div>
  );
}


function TitleSection() {
  return <div className={styles.title_section}>
    <div className={styles.paper_title}>
      <Ours />: Single-Image Scene Exploration with Precise 3D Camera Control
    </div>
    <VSpace rem={2} />
    <div className={styles.paper_author}>
      <a href="https://www.popov.im">Stefan Popov</a>
      <a href="http://amitraj93.github.io">Amit Raj</a>
      <a href="http://www.linkedin.com/in/mkrainin">Michael Krainin</a>
      <a href="http://people.csail.mit.edu/yzli">Yuanzhen Li</a>
      <a href="http://billf.mit.edu/">William T. Freeman</a>
      <a href="https://people.csail.mit.edu/mrub">Michael Rubinstein</a>
    </div>
    <VSpace rem={1.0} />
    <div>Google DeepMind</div>
    <VSpace rem={1.0} />
    <div>3DV 2025</div>
    <VSpace rem={2.0} />
    <div className={styles.link_container}>
      <Link href="https://arxiv.org/pdf/2501.06006" icon={"static/pdf_icon.svg"}>Paper</Link>
      <Link href="https://arxiv.org/abs/2501.06006" icon={"static/arxiv_icon.svg"}>arXiv</Link>
      <Link href="static/sup_mat.html">Supplementary material</Link>
    </div>
  </div>;
}

function VideoCarousel(props: {
  videos: string[], labels: string[], onVideoChanged?: (index: number) => void;
  twoColVideo?: boolean; speed?: number;
}) {
  const { videos, labels, onVideoChanged } = props;
  const cropLeft = props.twoColVideo ? "100cqw" : "200cqw";
  const vidW = props.twoColVideo ? "200cqw" : "300cqw";
  const renderThumb = React.useCallback((idx: number) => {
    return <Crop width={"100cqw"} left={cropLeft} >
      <img style={{ width: vidW }} src={videos[idx] + ".thumb.jpg"} />
    </Crop>;
  }, [videos, cropLeft, vidW])
  const renderVideo = React.useCallback(
    (idx: number, visible: boolean) =>
      <LabeledVideo url={videos[idx]} labels={labels} visible={visible} speed={props.speed}/>,
    [videos]);
  return <Carousel items={videos.length} renderMain={renderVideo}
    renderThumb={renderThumb} onVideoChanged={onVideoChanged} />;
}

function getTeaserVideos(re10k: string, dl3dv: string) {
  return [
    `${re10k}/8Gt9O1xpBDI_33033000.mp4`,
    `${dl3dv}/5K_e2d910e34aca8481be928aecc3aebe11820315345b4f64f46a1155e9ceda2626.mp4`, // speed?
    `${re10k}/zx8lnpzDG58_117350684.mp4`,
    `${dl3dv}/5K_eeb77c279db8be023f51a95eac7f678514632d16745e1bd5a4c6f2f369058d96.mp4`,
    // `${dl3dv}/5K_fa9bda8711c31b1427233426ef6f4f2cd05409de08d2c0c621ed932b57e5f2b5.mp4`,
    // `${re10k}/LGfI1TFvLG0_63096367.mp4`,
    `${re10k}/nx6nc1jMTiU_260927333.mp4`,
    `${re10k}/EBrfQIn1jbo_56222833.mp4`,
    `${re10k}/C5ldRCvjknU_208074000.mp4`,
    `${dl3dv}/5K_a0204c9a3617fd31fd2cde5f6f45d8438b56f76c425618984bbe491f424b1b43.mp4`,
    `${re10k}/BljTvsSN88U_60894000.mp4`,
    // `${re10k}/s9XuG5EVI6g_104438000.mp4`,
    `${dl3dv}/5K_bd061fa151c46e4044db4caaee559ac76c34a61472e5c3b9d9ac47548a40e399.mp4`,
  ];
}

function TeaserSection() {
  const dl3dv = "static/results_with_cam_traj/dl3dv_x1";
  const re10k = "static/results_with_cam_traj/re10k_x4";
  const videos = getTeaserVideos(re10k, dl3dv);

  const labels = ["Input image", "Input camera trajectory", "Generated video"];
  return <Section wide>
    <div className={styles.view_landscape}>* Videos look best in landscape.</div>
    <VideoCarousel videos={videos} labels={labels} />
    <VSpace rem={0.4} />
    <div className={styles.video_caption}> <Center>
      <Ours /> generates fly-through videos of a scene, from an input image
      and a user given camera trajectory.
    </Center></div>
  </Section>
}

function AbstractSection() {
  return <Section title="Abstract">
    <Justify>
      We propose a method for generating fly-through videos of a scene, from a
      single image and a camera trajectory. We build upon an image-to-video
      latent diffusion model. We condition its UNet denoiser on the camera
      trajectory, using four techniques. (1) We condition UNet's temporal blocks
      on raw camera extrinsics, similar to MotionCtrl. (2) We use images
      containing camera rays and directions, similar to CameraCtrl. (3) We
      re-project the initial image to sub-sequent frames and use the resulting
      video as a condition. (4) And we use 2D⇔3D transformers to introduce a
      global 3D representation, which implicitly conditions on the camera poses.
      We combine all conditions in a ContolNet-style architecture. We then
      propose a metric that evaluates overall video quality and the ability to
      preserve details with view changes, which we use to analyze the trade-offs
      of individual and combined conditions. Finally, we identify an optimal
      combination of conditions. We calibrate camera positions in our datasets
      for scale consistency across scenes, and we train our scene exploration
      model CamCtrl3D, demonstrating state-of-the-art results.
    </Justify>
  </Section>;
}

function OverviewSection() {
  return <Section title="Method overview">
    <Justify>
      <Ours /> takes an initial RGB image and a sequence of camera poses as
      input. The image depicts a virtual 3D scene from the perspective of the
      first camera. As output, <Ours /> generates a sequence of views of the
      virtual scene V, corresponding to the remaining cameras. To achieve this,
      we condition the UNet denoiser of Stable Video Diffusion (SVD) on the
      camera trajectory, as shown in the figure below.
    </Justify>
    <VSpace rem={2} />
    <img src="static/architecture.jpg" style={{ width: "100%" }} />
    <VSpace rem={2} />
    <Justify>
      We inject raw camera extrinsics into UNet's temporal layers. We use
      camera-dependent <a href="https://arxiv.org/abs/2203.13296">2D⇔3D
        transformers</a> to synchronize frame-local 2D features
      globally in 3D. We re-project the input image to the remaining views,
      relying on a <a href="https://arxiv.org/abs/2302.12288">metric depth
        detector</a>, and provide the resulting frames as
      input to the model. We further provide images containing the camera ray
      origins and directions.
    </Justify>
  </Section>
}

function InTheWildSection() {
  const vid_root = "static/results_with_cam_traj/in_the_wild";
  const colosseumLink = <a href="https://en.wikipedia.org/wiki/Colosseum#/media/File:Colosseo_2020.jpg" target="_blank" >Colosseum</a>;
  const gardensLink1 = <a href="https://en.wikipedia.org/wiki/Gardens_by_the_Bay#/media/File:Supertree_Grove,_Gardens_by_the_Bay,_Singapore_-_20120712-02.jpg" target="_blank">Gardens by the bay</a>
  const gardensLink2 = <a href="https://en.wikipedia.org/wiki/Gardens_by_the_Bay#/media/File:Flower_Dome_and_Cloud_Forest_Singapore_(36712606096).jpg" target="_blank">Gardens by the bay</a>
  const hayStackLink = <a href="https://en.m.wikipedia.org/wiki/File:Claude_Monet._Haystack._End_of_the_Summer._Morning._1891._Oil_on_canvas._Louvre,_Paris,_France.jpg" target="_blank">Haystack</a>;
  const treviLink = <a href="https://en.wikipedia.org/wiki/Trevi_Fountain#/media/File:Trevi_Fountain,_Rome,_Italy_2_-_May_2007.jpg" target="_blank">Trevi fountain</a>
  const oceanLink = <a href="https://maps.app.goo.gl/X4Ljyu2m3xA75WF47" target="_blank">Saint-Michel-Chef-Chef</a>

  const videos = [
    {
      v: `${vid_root}/haystack_paint_1.mp4`,
      d: <>{hayStackLink} painting by Claude Monet. <Ours /> understands the 3D structure of the painting. </>
    },
    {
      v: `${vid_root}/haystack_frame_1.mp4`,
      d: <> Haystacks in a frame, same camera motion. <Ours /> is context-aware and preserves the planar
        structure of the painting.</>
    },
    { v: `${vid_root}/ocean_1.mp4`, d: <>{oceanLink}, France. The model animates the waves, due to video priors.</> },
    { v: `${vid_root}/ocean_2.mp4`, d: <>{oceanLink}, France, another camera motion.</> },
    { v: `${vid_root}/ocean_3.mp4`, d: <>{oceanLink}, France, another camera motion.</> },
    { v: `${vid_root}/colosseum.mp4`, d: <>{colosseumLink}, Rome, Italy.</> },
    { v: `${vid_root}/trevi_fountain.mp4`, d: <>{treviLink}, Rome, Italy.</> },
    { v: `${vid_root}/flower_dome.mp4`, d: <>{gardensLink1}, Singapore.</> },
    { v: `${vid_root}/gardens_bay.mp4`, d: <>{gardensLink2}, Singapore.</> },
    { v: `${vid_root}/ice_caves.mp4`, d: <>Light streaming into an ice cave, Iceland.</> },
  ];

  const [vidIdx, setVidIdx] = React.useState(0);
  return <Section wide title="Out-of-training-distribution examples">
    <div className={styles.video_caption}><Center>
      These videos are generated from images that are out of distribution
      of our training data and are captured in the wild.</Center></div>
    <VSpace rem={1.5} />
    <VideoCarousel
      videos={videos.map((v) => v.v)}
      labels={["Input image", "Input camera trajectory", "Generated video"]}
      onVideoChanged={setVidIdx}
    />
    <VSpace rem={0.4} />
    <div className={styles.video_caption}><Center>{videos[vidIdx].d}</Center></div>
  </Section>;
}

function CompareToGtSection() {
  const dl3dv = "static/generated_vs_real/dl3dv_x1";
  const re10k = "static/generated_vs_real/re10k_x4";
  const videos = getTeaserVideos(re10k, dl3dv)
  return <Section title="Ground-truth vs. generated videos">
    <div className={styles.video_caption}>
      <Center>
        We compare ground-truth videos to videos generated generated by {" "}
        <Ours /> from the same first frame and with the same camera trajectory.
      </Center>
    </div>
    <VSpace rem={1.5} />
    <VideoCarousel
      videos={videos} twoColVideo
      labels={["Generated video", "Ground truth video, same trajectory"]}
      speed={0.6}
    />
  </Section>
}

function BibTeXSection() {
  return <Section title="BibTex">
    <pre className={styles.bibtex}>{`
@misc{popov24camctrl3d,
  title={CamCtrl3D: Single-Image Scene Exploration with Precise 3D Camera Control},
  author={Stefan Popov and Amit Raj and Michael Krainin and Yuanzhen Li and William T. Freeman and Michael Rubinstein},
  year={2025},
  eprint={2501.06006},
  archivePrefix={arXiv},
  primaryClass={cs.CV},
  url={https://arxiv.org/abs/2501.06006},
}
`}</pre>
  </Section>
}

function App() {
  return (
    <div className="body-container">
      <VSpace rem={2.0} />
      <TitleSection />
      <VSpace rem={3.0} />
      <TeaserSection />
      {/* <HSpace rem={4.0} />
      <AbstractSection /> */}
      <VSpace rem={3.0} />
      <OverviewSection />
      <VSpace rem={6.0} />
      <InTheWildSection />
      <VSpace rem={6.0} />
      <CompareToGtSection />
      <VSpace rem={6.0} />
      <BibTeXSection />
    </div>
  );
}

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
