import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getUserCredentials } from "../../Actions/login.actions";
import { clearPage, getCourseDetail } from "../../Actions/courses.actions";
import Rating from "@mui/material/Rating";
import Navbar from "../../Components/NavBars/Navbars";
import "./CourseDetail.css";
import Loader from "../../Components/Loader/Loader";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import Button from "../../Components/Buttons/Buttons";
import { addToCart, getLocalStorage } from "../../Actions/cart.actions";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import ReactPlayer from "react-player";
import { newReview } from "../../Actions/review.actions";
import CardsVideos from "../../Components/CardsVideos/CardsVideos";
import { getVideosCurses } from "../../Actions/videos.actions";
import { getProfileStudent } from "../../Actions/profile.action";

let defaultVideo = "https://www.youtube.com/watch?v=1R3hlqUMmk8";

const CourseDetail = React.memo(({ isLoggedIn }) => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { courseDetail } = useSelector((state) => state.courses);
  const { localStorageCart } = useSelector((state) => state.cart);
  const { userCredentials } = useSelector((state) => state.login);
  const { dataUser } = useSelector((state) => state.student);
  const { videos_curses } = useSelector((state) => state.videosCursos);

  const [favourite, setFavourite] = useState(false);
  const [rating, setRating] = useState(0);

  const video = videos_curses.length > 0 ? videos_curses[0].url : defaultVideo;

  const MySwal = withReactContent(Swal);

  const getCoursesNames = useCallback(() => {
    if (localStorageCart) {
      const coursesNames = localStorageCart.map((course) => course.name);
      return coursesNames.includes(courseDetail.name);
    }
  }, [localStorageCart, courseDetail]);

  const handleAddCart = useCallback(() => {
    if (isLoggedIn === "student" || isLoggedIn === "teacher") {
      MySwal.fire({
        title: `¿Quieres agregar ${courseDetail.name} al carrito?`,
        icon: "info",
        showDenyButton: true,
        confirmButtonText: "Aceptar",
        denyButtonText: "Cancelar",
      }).then((result) => {
        if (result.isConfirmed) {
          if (getCoursesNames()) {
            MySwal.fire({
              position: "center",
              icon: "error",
              title: "Ya tienes este curso en tu carrito",
              showConfirmButton: false,
              timer: 2000,
            });
            return;
          }
          dispatch(addToCart(courseDetail));
          MySwal.fire({
            position: "center",
            icon: "success",
            title: "Curso agregado correctamente",
            showConfirmButton: true,
            showDenyButton: true,
            denyButtonText: "Seguir viendo cursos",
            denyButtonColor: "#2b174f",
            confirmButtonText: "Ver mi carrito",
            confirmButtonColor: "#eabb39",
          }).then((res) => {
            if (res.isConfirmed) {
              navigate("/cart");
            } else if (res.isDenied) {
              navigate("/home");
            }
          });
        }
      });
    } else {
      MySwal.fire({
        position: "center",
        icon: "warning",
        title: "Por favor, inicia sesión para continuar",
        showConfirmButton: false,
        timer: 2000,
      });
      navigate("/login");
    }
  }, [isLoggedIn, getCoursesNames, courseDetail, dispatch, navigate, MySwal]);

  const onChange = useCallback((e) => {
    e.preventDefault();
    setRating(e.target.value);
  }, []);

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      if (isLoggedIn !== "teacher" && isLoggedIn !== "student") {
        MySwal.fire({
          position: "center-center",
          icon: "error",
          title: "Hubo un error",
          showConfirmButton: false,
          timer: 2500,
        });
        setTimeout(() => {
          navigate("/login");
        }, 1000);
      } else {
        if (isLoggedIn === "teacher") {
          MySwal.fire({
            position: "center-center",
            icon: "error",
            title: "No puede dejar review a sus cursos",
            showConfirmButton: false,
            timer: 2500,
          });
        } else {
          dispatch(
            newReview({
              score: rating,
              courseId: courseDetail.id,
              studentId: userCredentials.id,
            })
          );
          MySwal.fire({
            position: "center-center",
            icon: "success",
            title: "Gracias por dejar tu review!",
            showConfirmButton: false,
            timer: 2000,
          });
        }
      }
    },
    [
      isLoggedIn,
      rating,
      courseDetail,
      userCredentials,
      dispatch,
      MySwal,
      navigate,
    ]
  );

  useEffect(() => {
    dispatch(getCourseDetail(id));
    dispatch(getLocalStorage());
  }, [dispatch, id]);

  return (
    <section className="course-details">
      <div className="page-container">
        <Navbar isLoggedIn={isLoggedIn} />
        {courseDetail && (
          <div className="course-details_back-btn">
            <Button
              btnVariant={"raised"}
              text={"Volver a cursos"}
              link={"/home"}
            />
          </div>
        )}
        {courseDetail ? (
          <main className="course-details_card">
            <ReactPlayer
              className="course-details_image"
              url={`${video}?modestbranding=1&rel=0&showinfo=0`}
              //url={video}
              width="100%"
              height="100%"
              controls
              volume={0.5}
            />
            <div className="course-details_info">
              <header className="course-details_info_header">
                <h1 className="title">{courseDetail?.name}</h1>
              </header>
              <h3 className="course-details_info_author">
                Autor:{" "}
                {`${courseDetail?.teacherName} ${courseDetail?.teacherLastName}`}
              </h3>
              <Rating value={rating} onChange={onChange} />
              {rating > 0 && (
                <button
                  type="button"
                  className="button-review"
                  onClick={handleSubmit}
                >
                  Agregar Review
                </button>
              )}
              <p>{courseDetail?.description}</p>
              <h2>$ {courseDetail?.price}</h2>
              <div className="actionsButtons">
                {isLoggedIn !== "teacher" &&
                  !dataUser.courses?.includes(id) && (
                    <div className="buyBtn">
                      <Button
                        icon={"bi:cart-plus"}
                        btnVariant={"raised-icon"}
                        text={"Agregar al carrito"}
                        onClick={handleAddCart}
                        link={""}
                      />
                    </div>
                  )}
              </div>
            </div>
          </main>
        ) : (
          <Loader />
        )}
        {isLoggedIn === "teacher" && (
          <div className="profile_courses_create-btn">
            <Button
              btnVariant={"raised-icon"}
              text={"Agregar video"}
              icon={"eos-icons:content-new"}
              link={"/profile/createVideo"}
            />
          </div>
        )}
      </div>
      <CardsVideos id={id} />
    </section>
  );
});

export default CourseDetail;
