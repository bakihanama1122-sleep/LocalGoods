import React, { FC } from "react";
import HalfStar from "../../../../assets/svgs/HalfStar";
import StarFilled from "../../../../assets/svgs/FullStar";
import StarOutline from "../../../../assets/svgs/StarOutline";

type Props = {
  rating: number; 
};

const Ratings: FC<Props> = ({ rating }) => {
  const stars = [];

  for (let i = 1; i <= 5; i++) {
    if (i <= Math.floor(rating)) {
      stars.push(<StarFilled key={`star-${i}`} />);
    } else if (i === Math.ceil(rating) && rating % 1 !== 0) {
      stars.push(<HalfStar key={`star-${i}`} />);
    } else {
      stars.push(<StarOutline key={`star-${i}`} />);
    }
  }

  return (
    <div className="flex items-center gap-1">
      {stars}
      <span className="text-sm text-gray-600 ml-1">({rating?.toFixed(1)||0})</span>
    </div>
  );
};

export default Ratings;
