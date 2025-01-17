import React from "react";
import { FaFolder } from "react-icons/fa6";
import { IoDocumentOutline } from "react-icons/io5";

interface ItemIconProps {
  isFolder: boolean;
}

const ItemIcon: React.FC<ItemIconProps> = ({ isFolder }) => {
  return isFolder ? (
    <FaFolder size={20} />
  ) : (
    <IoDocumentOutline size={20} />
  );
};

export default ItemIcon;
