import CountrySearchCombobox from './CountrySearchCombobox.jsx';

export default function CountryCodeCombobox(props) {
  return (
    <CountrySearchCombobox
      valueKey="dialCode"
      placeholder="Search country or code"
      {...props}
    />
  );
}
