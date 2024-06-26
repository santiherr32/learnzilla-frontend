import axios from "axios";

export const GET_COURSES = "GET_COURSES";
export const GET_COURSE_DETAIL = "GET_COURSE_DETAIL";
export const CLEAR_PAGE = "CLEAR_PAGE";
export const GET_CATEGORIES = "GET_CATEGORIES";
export const SET_ORDER = "SET_ORDER";
export const GET_COURSES_TEACHER = "GET_COURSES_TEACHER";

export const getCourses =
  ({ order, category }) =>
  async (dispatch) => {
    const courses = await axios.get(
      `/courses?order=${order ? order : ""}&category=${
        category ? category : ""
      }`
    );
    return dispatch({
      type: GET_COURSES,
      payload: courses.data,
    });
  };

export const courseCreate = (form) => async (dispatch) => {
  await axios.post(`/courses/create`, form);
  return dispatch(getCourses({}));
};

export const getCategories = () => {
  return async (dispatch) => {
    const courses = await axios.get(`/category`);
    dispatch({
      type: GET_CATEGORIES,
      payload: courses.data,
    });
  };
};

export const getCourseDetail = (id) => {
  return async (dispatch) => {
    const course = await axios.get(`/courses/detail/${id}`);

    dispatch({
      type: GET_COURSE_DETAIL,
      payload: course.data,
    });
  };
};

export const getCoursesTeacher = (id) => {
  return async (dispatch) => {
    const courses = await axios.get(`/courses/teacher/${id}`);
    dispatch({
      type: GET_COURSES_TEACHER,
      payload: courses.data,
    });
  };
};

export const clearPage = () => {
  return {
    type: CLEAR_PAGE,
  };
};

export const setOrder = (payload) => {
  return {
    type: SET_ORDER,
    payload: payload,
  };
};
