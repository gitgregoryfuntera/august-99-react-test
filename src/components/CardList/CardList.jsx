import React, { useEffect, useState, useCallback, useRef } from "react";
import { uuid } from "uuidv4";
import { getLaunches } from "../../api/launches";
import CardItem from "../CardItem/CardItem";
import CardSearchInput from "../CardSearchInput/CardSearchInput";
import Spinner from "../Spinner";
import classes from "./CardList.module.scss";

const CardList = () => {
  const limit = 5;
  const [offset, setOffset] = useState(0);
  const [response, setResponse] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchVal, setSearchVal] = useState("");
  const [showEnd, setShowEnd] = useState(false);
  const observer = useRef();

  useEffect(() => {
    setIsLoading(true);
    const delayDebounce = setTimeout(() => {
      if (searchVal !== "") {
        const searchList = response.filter(
          (stateValue) =>
            stateValue.mission_name.toLowerCase() === searchVal.toLowerCase()
        );
        setResponse(searchList);
        setIsLoading(false);
      }

      if (searchVal === "") {
        fetchLaunches(0);
      }
    }, 1500);
    return () => clearTimeout(delayDebounce);
  }, [searchVal]);

  useEffect(() => {
    if (offset > 0 && !showEnd) {
      setIsLoading(true);
      // Added timeout to show loader
      setTimeout(() => {
          fetchLaunches(offset);
      }, 1500);
    }
  }, [offset]);

  const lastElement = useCallback(
    (node) => {
      if (isLoading) {
        return;
      }

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting === true && response.length >= 5) {
          setOffset((prevState) => prevState + 5);
        }
      });
      if (node) {
        return observer.current.observe(node);
      }
    },
    [isLoading]
  );

  const fetchLaunches = async (offSet) => {
    try {
      const launches = await getLaunches(limit, offSet);
      const data = (await launches.json()) || [];
      const { length } = data;

      if (!length) {
        setShowEnd(true);
      }

      if (length && offSet === 0) {
        setResponse(data); // set initial response
        setOffset(0);
        setShowEnd(false);
      }

      if (length && offSet !== 0) {
        setResponse((prevState) => [...prevState, ...data]); // append existing response
      }

      setIsLoading(false);
    } catch (e) {
      console.error("something bad happened fetching launches");
      setIsLoading(false);
    }
  };

  const { length } = response;

  let content = <></>;

  if (length) {
    content = (
      <ul className={classes.listContainer}>
        {response.map((value, index) => {
          if (index === response.length - 1) {
            return (
              <li ref={lastElement} key={uuid()} className={classes.listItem}>
                <CardItem
                  mission_name={value.mission_name}
                  launch_success={value.launch_success}
                  links={value.links}
                  details={value.details}
                />
              </li>
            );
          }
          return (
            <li key={uuid()} className={classes.listItem}>
              <CardItem
                mission_name={value.mission_name}
                launch_success={value.launch_success}
                links={value.links}
                details={value.details}
              />
            </li>
          );
        })}
      </ul>
    );
  }

  const handleOnChange = (e) => {
    const {
      target: { value },
    } = e;
    setSearchVal(value);
  };

  return (
    <>
      <CardSearchInput handleOnChange={handleOnChange} />
      {content}
      {showEnd && <p>End of list.</p>}
      {isLoading && <Spinner />}
    </>
  );
};

export default CardList;
