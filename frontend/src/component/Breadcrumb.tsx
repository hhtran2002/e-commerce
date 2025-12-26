import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import '../style/Breadcrumb.css';

const Breadcrumb = ({title}:{title:string}) => {
  const navigate = useNavigate();

  return (
    <div className="breadcrumb-container">
      <span className="breadcrumb-back" onClick={() => navigate('/')}>
      </span>
      <span className="breadcrumb-title">{title}</span>
    </div>
  );
};

export default Breadcrumb;