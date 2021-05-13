/* eslint-disable */
/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { useRef, useCallback, useEffect } from "react"
import classnames from "classnames"
import { useHistory } from "@docusaurus/router"
import useDocusaurusContext from "@docusaurus/useDocusaurusContext"
import "./styles.css"

let loaded = false
const Search = (props) => {
  const initialized = useRef(false)
  const searchBarRef = useRef(null)
  const history = useHistory()
  const { siteConfig = {} } = useDocusaurusContext()
  const { baseUrl } = siteConfig
  const initAlgolia = () => {
    if (!initialized.current) {
      new window.DocSearch({
        searchData: window.searchData,
        inputSelector: "#search_input_react",
        // Override algolia's default selection event, allowing us to do client-side
        // navigation and avoiding a full page refresh.
        handleSelected: (_input, _event, suggestion) => {
          const url = baseUrl + suggestion.url
          // Use an anchor tag to parse the absolute url into a relative url
          // Alternatively, we can use new URL(suggestion.url) but its not supported in IE
          const a = document.createElement("a")
          a.href = url
          // Algolia use closest parent element id #__docusaurus when a h1 page title does not have an id
          // So, we can safely remove it. See https://github.com/facebook/docusaurus/issues/1828 for more details.

          history.push(url)
        },
      })
      initialized.current = true
    }
  }

  const getSearchData = () =>
    process.env.NODE_ENV === "production"
      ? fetch(`${baseUrl}search-doc.json`).then((content) => content.json())
      : Promise.resolve([])

  const loadAlgolia = () => {
    if (!loaded) {
      Promise.all([
        getSearchData(),
        import("./lib/DocSearch"),
        import("./algolia.css"),
      ]).then(([searchData, { default: DocSearch }]) => {
        loaded = true
        window.searchData = searchData
        window.DocSearch = DocSearch
        initAlgolia()
      })
    } else {
      initAlgolia()
    }
  }

  const toggleSearchIconClick = useCallback(
    (e) => {
      if (!searchBarRef.current.contains(e.target)) {
        searchBarRef.current.focus()
      }

      props.handleSearchBarToggle &&
        props.handleSearchBarToggle(!props.isSearchBarExpanded)
    },
    [props.isSearchBarExpanded]
  )

  useEffect(() => {
    document.addEventListener("keypress", (e) => {
      if (document.activeElement === searchBarRef.current) return
      if (e.key === "/") {
        e.preventDefault()
        searchBarRef.current.focus()
      }
    })
    return () => document.removeEventListener("keypress")
  }, [])

  return (
    <div className="navbar__search" key="search-box">
      <span
        aria-label="expand searchbar"
        role="button"
        className={classnames("search-icon", {
          "search-icon-hidden": props.isSearchBarExpanded,
        })}
        onClick={toggleSearchIconClick}
        onKeyDown={toggleSearchIconClick}
        tabIndex={0}
      />
      <input
        id="search_input_react"
        type="search"
        placeholder="Search"
        aria-label="Search"
        className={classnames(
          "navbar__search-input",
          { "search-bar-expanded": props.isSearchBarExpanded },
          { "search-bar": !props.isSearchBarExpanded }
        )}
        onClick={loadAlgolia}
        onMouseOver={loadAlgolia}
        onFocus={toggleSearchIconClick}
        onBlur={toggleSearchIconClick}
        ref={searchBarRef}
      />

      <svg
        x="0px"
        y="0px"
        width="19px"
        height="20px"
        viewBox="0 0 19 20"
        className={classnames("search-icon-keyboard", {
          "search-icon-hidden": props.isSearchBarExpanded,
        })}
      >
        <path
          fill="none"
          stroke="#979A9C"
          opacity="0.4"
          d="M3.5,0.5h12c1.7,0,3,1.3,3,3v13c0,1.7-1.3,3-3,3h-12c-1.7,0-3-1.3-3-3v-13C0.5,1.8,1.8,0.5,3.5,0.5z"
        />
        <path fill="#979a9c" d="M11.8,6L8,15.1H7.1L10.8,6L11.8,6z" />
      </svg>
    </div>
  )
}

export default Search
