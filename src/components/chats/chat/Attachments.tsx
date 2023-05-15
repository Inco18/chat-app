import React, { useEffect, useState } from "react";
import { CSSTransition } from "react-transition-group";
import Lightbox from "yet-another-react-lightbox";
import Captions from "yet-another-react-lightbox/plugins/captions";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Video from "yet-another-react-lightbox/plugins/video";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Counter from "yet-another-react-lightbox/plugins/counter";
import Download from "yet-another-react-lightbox/plugins/download";
import "yet-another-react-lightbox/plugins/captions.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import "yet-another-react-lightbox/plugins/counter.css";
import "yet-another-react-lightbox/styles.css";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { stateType } from "./ChatSidebar";

import { ReactComponent as Close } from "../../../assets/remove.svg";
import { ReactComponent as File } from "../../../assets/file.svg";

import styles from "./Attachments.module.css";
import { ThreeDots } from "react-loader-spinner";

const photos = [
  {
    src: "https://waskiel.pl/wp-content/uploads/2017/09/jak-zrobic-dobre-zdjecie-ustawienia-aparatu.jpg",
  },
  {
    src: "https://images.unsplash.com/photo-1508921912186-1d1a45ebb3c1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8cGhvdG98ZW58MHx8MHx8&w=1000&q=80",
  },
  {
    src: "https://images.pexels.com/photos/2893685/pexels-photo-2893685.jpeg?cs=srgb&dl=pexels-oziel-g%C3%B3mez-2893685.jpg&fm=jpg",
  },
  {
    src: "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885_960_720.jpg",
  },
  {
    src: "https://images.ctfassets.net/az3stxsro5h5/24L2UM6hV3m4csMvBzkHbj/9d4583541bdb29ae0c6a9ff2b60f1313/After.jpeg?w=2389&h=2986&fl=progressive&q=50&fm=jpg",
  },
  {
    src: "https://images.unsplash.com/photo-1554080353-a576cf803bda?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NHx8cGhvdG98ZW58MHx8MHx8&w=1000&q=80",
  },
  {
    src: "https://images.pexels.com/photos/2690807/pexels-photo-2690807.jpeg?cs=srgb&dl=pexels-tobias-bj%C3%B8rkli-2690807.jpg&fm=jpg",
  },
  {
    src: "https://img.freepik.com/free-photo/wide-angle-shot-single-tree-growing-clouded-sky-during-sunset-surrounded-by-grass_181624-22807.jpg",
  },
  {
    src: "https://img.freepik.com/free-photo/road-mountains-with-cloudy-sky_1340-23022.jpg",
  },
  {
    src: "https://images.pexels.com/photos/1557652/pexels-photo-1557652.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
  },
  {
    src: "https://thumbs.dreamstime.com/b/beautiful-rain-forest-ang-ka-nature-trail-doi-inthanon-national-park-thailand-36703721.jpg",
  },
  {
    src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS5KzzzWndcoX4__uO-z2bWXyI-fySpD0k-_A&usqp=CAU",
  },
  {
    src: "https://media.npr.org/assets/img/2022/08/05/ff_06-29-21_5da_01_srgb_2400px_atc_v1_custom-870ba85b3dd31be4118750ffe05cf30f736db61e-s1100-c50.jpg",
  },
  {
    src: "https://img.freepik.com/free-photo/colorful-heart-air-balloon-shape-collection-concept-isolated-color-background-beautiful-heart-ball-event_90220-1047.jpg",
  },
  {
    src: "https://www.ap.org/assets/images/about/image-5.jpg",
  },
  {
    src: "https://images.unsplash.com/photo-1508921912186-1d1a45ebb3c1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8cGhvdG98ZW58MHx8MHx8&w=1000&q=80",
  },
  {
    src: "https://images.pexels.com/photos/2893685/pexels-photo-2893685.jpeg?cs=srgb&dl=pexels-oziel-g%C3%B3mez-2893685.jpg&fm=jpg",
  },
  {
    src: "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885_960_720.jpg",
  },
  {
    src: "https://images.ctfassets.net/az3stxsro5h5/24L2UM6hV3m4csMvBzkHbj/9d4583541bdb29ae0c6a9ff2b60f1313/After.jpeg?w=2389&h=2986&fl=progressive&q=50&fm=jpg",
  },
  {
    src: "https://images.unsplash.com/photo-1554080353-a576cf803bda?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NHx8cGhvdG98ZW58MHx8MHx8&w=1000&q=80",
  },
  {
    src: "https://images.pexels.com/photos/2690807/pexels-photo-2690807.jpeg?cs=srgb&dl=pexels-tobias-bj%C3%B8rkli-2690807.jpg&fm=jpg",
  },
  {
    src: "https://img.freepik.com/free-photo/wide-angle-shot-single-tree-growing-clouded-sky-during-sunset-surrounded-by-grass_181624-22807.jpg",
  },
  {
    src: "https://img.freepik.com/free-photo/road-mountains-with-cloudy-sky_1340-23022.jpg",
  },
  {
    src: "https://images.pexels.com/photos/1557652/pexels-photo-1557652.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
  },
  {
    src: "https://waskiel.pl/wp-content/uploads/2017/09/jak-zrobic-dobre-zdjecie-ustawienia-aparatu.jpg",
  },
  {
    src: "https://www.popsci.com/uploads/2019/01/07/UQL4MLA6MXE6ECSZHOSXA3LA4E.jpg?auto=webp",
  },
  {
    src: "https://iso.500px.com/wp-content/uploads/2016/02/stock-photo-114337435-1500x1000.jpg",
  },
  {
    src: "https://www.befunky.com/images/prismic/5ddfea42-7377-4bef-9ac4-f3bd407d52ab_landing-photo-to-cartoon-img5.jpeg?auto=avif,webp&format=jpg&width=863",
  },
  {
    src: "https://api.time.com/wp-content/uploads/2019/08/better-smartphone-photos.jpg",
  },
  {
    src: "https://plus.unsplash.com/premium_photo-1664701475272-953393050754?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8cGhvdG98ZW58MHx8MHx8&w=1000&q=80",
  },
  {
    src: "https://images.unsplash.com/photo-1508921912186-1d1a45ebb3c1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8cGhvdG98ZW58MHx8MHx8&w=1000&q=80",
  },
  {
    src: "https://images.pexels.com/photos/2893685/pexels-photo-2893685.jpeg?cs=srgb&dl=pexels-oziel-g%C3%B3mez-2893685.jpg&fm=jpg",
  },
  {
    src: "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885_960_720.jpg",
  },
  {
    src: "https://images.ctfassets.net/az3stxsro5h5/24L2UM6hV3m4csMvBzkHbj/9d4583541bdb29ae0c6a9ff2b60f1313/After.jpeg?w=2389&h=2986&fl=progressive&q=50&fm=jpg",
  },
  {
    src: "https://images.unsplash.com/photo-1554080353-a576cf803bda?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NHx8cGhvdG98ZW58MHx8MHx8&w=1000&q=80",
  },
  {
    src: "https://images.pexels.com/photos/2690807/pexels-photo-2690807.jpeg?cs=srgb&dl=pexels-tobias-bj%C3%B8rkli-2690807.jpg&fm=jpg",
  },
  {
    src: "https://img.freepik.com/free-photo/wide-angle-shot-single-tree-growing-clouded-sky-during-sunset-surrounded-by-grass_181624-22807.jpg",
  },
  {
    src: "https://img.freepik.com/free-photo/road-mountains-with-cloudy-sky_1340-23022.jpg",
  },
  {
    src: "https://images.pexels.com/photos/1557652/pexels-photo-1557652.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
  },
  {
    src: "https://waskiel.pl/wp-content/uploads/2017/09/jak-zrobic-dobre-zdjecie-ustawienia-aparatu.jpg",
  },
  {
    src: "https://images.ctfassets.net/hrltx12pl8hq/5596z2BCR9KmT1KeRBrOQa/4070fd4e2f1a13f71c2c46afeb18e41c/shutterstock_451077043-hero1.jpg",
  },
  {
    src: "https://live.staticflickr.com/65535/52530446584_cb1dce6453_z.jpg",
  },
  {
    src: "https://iso.500px.com/wp-content/uploads/2016/11/stock-photo-159533631-1500x1000.jpg",
  },
];

const Attachments = (props: {
  state: stateType;
  closeFunction: () => void;
}) => {
  const [page, setPage] = useState<"photos" | "files" | undefined>(
    props.state.initialAttachments
  );

  const [photoIndex, setPhotoIndex] = useState<number>(-1);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  useEffect(() => {
    if (props.state.initialAttachments !== undefined) {
      setPage(props.state.initialAttachments);
    }
  }, [props.state.initialAttachments]);

  const handlePhotoClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).nodeName === "IMG") {
      setPhotoIndex(parseInt((e.target as HTMLElement).id));
    }
  };

  return (
    <CSSTransition
      in={props.state.attachmentsContainerVisible}
      timeout={300}
      classNames={{
        enter: styles.attachmentsEnter,
        enterActive: styles.attachmentsEnterActive,
        exit: styles.attachmentsExit,
        exitActive: styles.attachmentsExitActive,
      }}
      onEntered={() => setIsLoaded(true)}
      onExited={() => setIsLoaded(false)}
      unmountOnExit
    >
      <div className={styles.container}>
        <div className={styles.innerContainer}>
          <div className={styles.topContainer}>
            <Close
              className={styles.closeIcon}
              onClick={props.closeFunction}
              tabIndex={0}
              aria-label="close attachments"
            />
            Attachments
          </div>

          <div className={styles.navContainer}>
            <button
              tabIndex={0}
              className={`${styles.navButton} ${
                page === "photos" ? styles.active : ""
              }`}
              onClick={() => setPage("photos")}
            >
              Photos
            </button>
            <button
              tabIndex={0}
              className={`${styles.navButton} ${
                page === "files" ? styles.active : ""
              }`}
              onClick={() => setPage("files")}
            >
              Files
            </button>
          </div>
          {page === "photos" && (
            <div className={styles.photosContainer} onClick={handlePhotoClick}>
              {photos.map((photo, i) => {
                if (i < 4) {
                  return (
                    <LazyLoadImage
                      src={photo.src}
                      id={i.toString()}
                      key={i}
                      effect="opacity"
                    />
                  );
                }
              })}
              {!isLoaded && photos.length >= 4 && (
                <ThreeDots color="var(--text)" height={50} width={50} />
              )}
              {isLoaded &&
                photos.map((photo, i) => {
                  if (i >= 4) {
                    return (
                      <LazyLoadImage
                        src={photo.src}
                        id={i.toString()}
                        key={i}
                        effect="opacity"
                      />
                    );
                  }
                })}
            </div>
          )}
          {page === "files" && (
            <ul className={styles.filesContainer}>
              <li className={styles.file}>
                <File className={styles.fileIcon} />
                <div className={styles.fileRightContainer}>
                  <p className={styles.fileName}>
                    Test File 1 dwadawdw dawa dawdawdaw dwaawd dwaaw
                  </p>
                  <p className={styles.fileSize}>1,25 MB</p>
                </div>
              </li>
              <li className={styles.file}>
                <File className={styles.fileIcon} />
                <div className={styles.fileRightContainer}>
                  <p className={styles.fileName}>Test File 2</p>
                  <p className={styles.fileSize}>478 KB</p>
                </div>
              </li>
              <li className={styles.file}>
                <File className={styles.fileIcon} />
                <div className={styles.fileRightContainer}>
                  <p className={styles.fileName}>Test File 3</p>
                  <p className={styles.fileSize}>10 KB</p>
                </div>
              </li>
              <li className={styles.file}>
                <File className={styles.fileIcon} />
                <div className={styles.fileRightContainer}>
                  <p className={styles.fileName}>Test File 4</p>
                  <p className={styles.fileSize}>1 MB</p>
                </div>
              </li>
              <li className={styles.file}>
                <File className={styles.fileIcon} />
                <div className={styles.fileRightContainer}>
                  <p className={styles.fileName}>Test File 5</p>
                  <p className={styles.fileSize}>1,5 MB</p>
                </div>
              </li>
              <li className={styles.file}>
                <File className={styles.fileIcon} />
                <div className={styles.fileRightContainer}>
                  <p className={styles.fileName}>Test File 6</p>
                  <p className={styles.fileSize}>4 MB</p>
                </div>
              </li>
              <li className={styles.file}>
                <File className={styles.fileIcon} />
                <div className={styles.fileRightContainer}>
                  <p className={styles.fileName}>Test File 7</p>
                  <p className={styles.fileSize}>15 KB</p>
                </div>
              </li>
            </ul>
          )}
        </div>
        <Lightbox
          open={photoIndex >= 0}
          close={() => setPhotoIndex(-1)}
          slides={photos}
          index={photoIndex}
          thumbnails={{
            padding: 0,
            border: 0,
            borderRadius: 15,
            imageFit: "cover",
            height: 50,
            width: 50,
          }}
          carousel={{ finite: true, spacing: "0px", preload: 10 }}
          controller={{ closeOnBackdropClick: true }}
          animation={{ swipe: 250 }}
          plugins={[
            Fullscreen,
            Thumbnails,
            Counter,
            Download,
            Video,
            Zoom,
            Captions,
          ]}
        />
      </div>
    </CSSTransition>
  );
};

export default Attachments;
