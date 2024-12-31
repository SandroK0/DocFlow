import React from "react";
import { IoIosDocument } from "react-icons/io";
import { FaFolderOpen } from "react-icons/fa6";


interface ItemIconProps {
  isFolder: boolean;
}

const ItemIcon: React.FC<ItemIconProps> = ({ isFolder }) => {
  return isFolder ? (
    <FaFolderOpen size={50} />
  ) : (
    <IoIosDocument size={50} />
  );
};

export default ItemIcon;
