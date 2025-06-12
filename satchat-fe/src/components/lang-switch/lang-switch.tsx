"use client";

import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import i18n from "../../i18n/config";
import { getCookie } from "cookies-next";
import { Box, IconButton, MenuItem, Stack } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { PopMenu } from ".";
import Image from "next/image";

const LangSwitch = () => {
  const { t } = useTranslation();
  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);

  // Track current selected language
  const [currentLanguage, setCurrentLanguage] = useState("en-US");

  useEffect(() => {
    const lang = getCookie("defaultLocale") || i18n.language || "en-US";
    setCurrentLanguage(lang as string);
    i18n.changeLanguage(lang as string);
  }, []);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // Handle language selection and update the current language
  const handleChoiceLanguage = (lang: string) => {
    setCurrentLanguage(lang);
    i18n.changeLanguage(lang);
    document.cookie = `defaultLocale=${lang};`;
    setOpen(false);
  };

  return (
    <>
      <IconButton
        disableRipple={true}
        ref={anchorRef}
        component="div"
        onClick={handleOpen}
        sx={{
          padding: 2,
          width: 28,
          height: 28,
          color: "var(--foreground)",
          ...(open && {
            bgcolor: "transparent",
          }),
        }}
      >
        <Image
          src={`/icons/ic_flag_${currentLanguage}.svg`}
          alt={t(`language.${currentLanguage}`)}
          fill
        />
      </IconButton>

      <PopMenu
        open={open}
        onClose={handleClose}
        anchorEl={anchorRef.current}
        sx={{
          mt: 2,
          ml: 2,
          width: 180,
          "& .MuiMenuItem-root": {
            px: 1,
            typography: "body2",
            borderRadius: 0.75,
          },
        }}
      >
        <Stack spacing={0.75}>
          <MenuItem
            selected={currentLanguage === "en-US"}
            onClick={() => handleChoiceLanguage("en-US")}
          >
            <Box
              component="img"
              alt="English"
              src="/icons/ic_flag_en-US.svg"
              sx={{ width: 28, mr: 2 }}
            />
            {t("language.English")}
          </MenuItem>

          <MenuItem
            selected={currentLanguage === "vi-VN"}
            onClick={() => handleChoiceLanguage("vi-VN")}
          >
            <Box
              component="img"
              alt="Vietnamese"
              src="/icons/ic_flag_vi-VN.svg"
              sx={{ width: 28, mr: 2 }}
            />
            {t("language.Vietnam")}
          </MenuItem>

          <MenuItem
            selected={currentLanguage === "fr-FR"}
            onClick={() => handleChoiceLanguage("fr-FR")}
          >
            <Box
              component="img"
              alt="French"
              src="/icons/ic_flag_fr-FR.svg"
              sx={{ width: 28, mr: 2 }}
            />
            {t("language.French")}
          </MenuItem>
        </Stack>
      </PopMenu>
    </>
  );
};

export default LangSwitch;
