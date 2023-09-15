import React, { useEffect, useState } from "react";
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
import { ThreeDots } from "react-loader-spinner";
import { getDownloadURL, getMetadata, listAll, ref } from "firebase/storage";
import { storage } from "../../../services/firebase";
import { useAppSelector } from "../../../hooks/reduxHooks";
import Spinner from "../../UI/Spinner";
import fileDownload from "js-file-download";
import styles from "./Attachments.module.css";
import { toast } from "react-toastify";

function formatBytes(bytes: number, decimals = 2) {
  if (!+bytes) return "0 B";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

const Attachments = (props: {
  state: stateType;
  closeFunction: () => void;
  isLoaded: boolean;
}) => {
  const [page, setPage] = useState<"photos" | "files" | undefined>(
    props.state.initialAttachments
  );
  const [photoIndex, setPhotoIndex] = useState<number>(-1);
  const [photos, setPhotos] = useState<{ src: string; addedAt: string }[]>([]);
  const [files, setFiles] = useState<
    {
      name: string;
      size: number;
      url: string;
      addedAt: string;
    }[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);

  const chatState = useAppSelector((state) => state.chat);

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

  useEffect(() => {
    const storageRef = ref(storage, `chats/${chatState.id}`);
    const photosArr: { src: string; addedAt: string }[] = [];
    const filesArr: {
      name: string;
      size: number;
      url: string;
      addedAt: string;
    }[] = [];
    const getList = async () => {
      const res = await listAll(storageRef);
      await Promise.all(
        res.items.map(async (itemRef) => {
          const metadata = await getMetadata(itemRef);
          if (metadata.contentType?.includes("image")) {
            const url = await getDownloadURL(itemRef);
            photosArr.push({ src: url, addedAt: metadata.timeCreated });
          } else {
            const url = await getDownloadURL(itemRef);
            filesArr.push({
              name: metadata.name,
              size: metadata.size,
              url,
              addedAt: metadata.timeCreated,
            });
          }
        })
      );

      const sortedPhotos = photosArr.sort((a, b) => {
        return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime();
      });
      const sortedFiles = filesArr.sort((a, b) => {
        return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime();
      });
      setPhotos(sortedPhotos);
      setFiles(sortedFiles);
      setIsLoading(false);
    };
    try {
      getList();
    } catch (error: any) {
      toast.error("Could not load files: " + error.message);
    }
  }, []);

  return (
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
        {isLoading && <Spinner />}
        {page === "photos" && (
          <div className={styles.photosContainer} onClick={handlePhotoClick}>
            {photos.map((photo, i) => {
              if (i < 4) {
                return (
                  <LazyLoadImage
                    src={photo.src}
                    id={i.toString()}
                    key={photo.src}
                    effect="blur"
                  />
                );
              }
            })}
            {!props.isLoaded && photos.length >= 4 && (
              <ThreeDots color="var(--text)" height={50} width={50} />
            )}
            {props.isLoaded &&
              photos.map((photo, i) => {
                if (i >= 4) {
                  return (
                    <LazyLoadImage
                      src={photo.src}
                      id={i.toString()}
                      key={photo.src}
                      effect="blur"
                    />
                  );
                }
              })}
          </div>
        )}
        {page === "files" && (
          <ul className={styles.filesContainer}>
            {files.map((file) => {
              return (
                <li
                  title={file.name}
                  key={file.name}
                  tabIndex={0}
                  className={styles.file}
                  onClick={() => {
                    const xhr = new XMLHttpRequest();
                    xhr.responseType = "blob";
                    xhr.onload = (event) => {
                      const blob = xhr.response;
                      fileDownload(blob, file.name);
                    };
                    xhr.open("GET", file.url);
                    xhr.send();
                  }}
                >
                  <File className={styles.fileIcon} />
                  <div className={styles.fileRightContainer}>
                    <p className={styles.fileName}>{file.name}</p>
                    <p className={styles.fileSize}>{formatBytes(file.size)}</p>
                  </div>
                </li>
              );
            })}
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
  );
};

export default Attachments;
