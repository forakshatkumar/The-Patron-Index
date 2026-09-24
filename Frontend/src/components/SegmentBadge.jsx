function SegmentBadge({ segment }) {
  const getSegmentClass = () => {
    const normalized = segment
      .toLowerCase()
      .replaceAll(" ", "-");

    switch (normalized) {
      case "vip":
      case "vip-customer":
      case "vip-customers":
        return "segment-vip";

      case "loyal":
        return "segment-loyal";

      case "regular":
        return "segment-regular";

      case "new":
        return "segment-new";

      case "occasional":
        return "segment-occasional";

      case "at-risk":
        return "segment-risk";

      case "inactive":
        return "segment-inactive";

      default:
        return "segment-default";
    }
  };

  return (
    <span
      className={`segment-badge ${getSegmentClass()}`}
    >
      {segment}
    </span>
  );
}

export default SegmentBadge;