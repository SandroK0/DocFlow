import React from "react";
import { RiFolderFill } from "react-icons/ri";
import { IoDocumentTextOutline } from "react-icons/io5";

interface ItemIconProps {
  isFolder: boolean;
}

const ItemIcon: React.FC<ItemIconProps> = ({ isFolder }) => {
  return isFolder ? (
    <RiFolderFill size={50} />
  ) : (
    <IoDocumentTextOutline size={50} />
  );
};

export default ItemIcon;
