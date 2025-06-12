"use client";

import { Box } from "@mui/material";
import "./styles.css";
import Link from "next/link";
import { ThemeSwitch } from "../theme-switch";
import { LangSwitch } from "../lang-switch";
import { AccountPopup } from "../account-popup";
import { commonStore } from "@/store/reducers";
import { useDispatch } from "react-redux";
import { Search } from "lucide-react";
import { useTranslation } from "react-i18next";

const Navbar = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  return (
    <div className="navbar">
      <Link href="/">
        <div className="logo">Connected</div>
      </Link>
      <div className="relative w-full max-w-md">
        <div className="flex items-center rounded-lg border border-gray-200 bg-[var(--background)] shadow-sm hover:shadow">
          <div className="pl-3">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder={t("navbar.SearchPlaceholder")}
            className="w-full py-2 px-3 bg-transparent outline-none text-[var(--foreground)] cursor-pointer"
            onClick={() => {
              dispatch(commonStore.actions.setSearchBar(true));
            }}
            readOnly
          />
        </div>
      </div>
      <div className="nav-controls">
        <Box sx={{ color: "var(--foreground)" }}>
          <LangSwitch />
        </Box>
        <Box sx={{ color: "var(--foreground)" }}>
          <ThemeSwitch
            style={{
              width: "35px",
              borderRadius: "20px",
              padding: "4px",
            }}
          />
        </Box>
        <AccountPopup />
      </div>
    </div>
  );
};

export default Navbar;
