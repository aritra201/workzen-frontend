import CountrySearchCombobox from './CountrySearchCombobox.jsx';

export default function CountryNameCombobox(props) {
  return (
    <CountrySearchCombobox
      valueKey="countryName"
      placeholder="Search country"
      {...props}
    />
  );
}
