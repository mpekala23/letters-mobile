export const STATES = {
  AK: 'Alaska',
  AL: 'Alabama',
  AR: 'Arkansas',
  AS: 'American Samoa',
  AZ: 'Arizona',
  CA: 'California',
  CO: 'Colorado',
  CT: 'Connecticut',
  DC: 'District of Columbia',
  DE: 'Delaware',
  FL: 'Florida',
  GA: 'Georgia',
  GU: 'Guam',
  HI: 'Hawaii',
  IA: 'Iowa',
  ID: 'Idaho',
  IL: 'Illinois',
  IN: 'Indiana',
  KS: 'Kansas',
  KY: 'Kentucky',
  LA: 'Louisiana',
  MA: 'Massachusetts',
  MD: 'Maryland',
  ME: 'Maine',
  MI: 'Michigan',
  MN: 'Minnesota',
  MO: 'Missouri',
  MS: 'Mississippi',
  MT: 'Montana',
  NC: 'North Carolina',
  ND: 'North Dakota',
  NE: 'Nebraska',
  NH: 'New Hampshire',
  NJ: 'New Jersey',
  NM: 'New Mexico',
  NV: 'Nevada',
  NY: 'New York',
  OH: 'Ohio',
  OK: 'Oklahoma',
  OR: 'Oregon',
  PA: 'Pennsylvania',
  PR: 'Puerto Rico',
  RI: 'Rhode Island',
  SC: 'South Carolina',
  SD: 'South Dakota',
  TN: 'Tennessee',
  TX: 'Texas',
  UT: 'Utah',
  VA: 'Virginia',
  VI: 'Virgin Islands',
  VT: 'Vermont',
  WA: 'Washington',
  WI: 'Wisconsin',
  WV: 'West Virginia',
  WY: 'Wyoming',
};

export const STATES_DROPDOWN = [
  ['Alaska', 'AK'],
  ['Alabama', 'AL'],
  ['Arkansas', 'AR'],
  ['American Samoa', 'AS'],
  ['Arizona', 'AZ'],
  ['California', 'CA'],
  ['Colorado', 'CO'],
  ['Connecticut', 'CT'],
  ['District of Columbia', 'DC'],
  ['Delaware', 'DE'],
  ['Florida', 'FL'],
  ['Georgia', 'GA'],
  ['Guam', 'GU'],
  ['Hawaii', 'HI'],
  ['Iowa', 'IA'],
  ['Idaho', 'ID'],
  ['Illinois', 'IL'],
  ['Indiana', 'IN'],
  ['Kansas', 'KS'],
  ['Kentucky', 'KY'],
  ['Louisiana', 'LA'],
  ['Massachusetts', 'MA'],
  ['Maryland', 'MD'],
  ['Maine', 'ME'],
  ['Michigan', 'MI'],
  ['Minnesota', 'MN'],
  ['Missouri', 'MO'],
  ['Mississippi', 'MS'],
  ['Montana', 'MT'],
  ['North Carolina', 'NC'],
  ['North Dakota', 'ND'],
  ['Nebraska', 'NE'],
  ['New Hampshire', 'NH'],
  ['New Jersey', 'NJ'],
  ['New Mexico', 'NM'],
  ['Nevada', 'NV'],
  ['New York', 'NY'],
  ['Ohio', 'OH'],
  ['Oklahoma', 'OK'],
  ['Oregon', 'OR'],
  ['Pennsylvania', 'PA'],
  ['Puerto Rico', 'PR'],
  ['Rhode Island', 'RI'],
  ['South Carolina', 'SC'],
  ['South Dakota', 'SD'],
  ['Tennessee', 'TN'],
  ['Texas', 'TX'],
  ['Utah', 'UT'],
  ['Virginia', 'VA'],
  ['Virgin Islands', 'VI'],
  ['Vermont', 'VT'],
  ['Washington', 'WA'],
  ['Wisconsin', 'WI'],
  ['West Virginia', 'WV'],
  ['Wyoming', 'WY'],
];

export const STATES_DATABASE = {
  AK: { link: '' },
  AL: { link: 'http://www.doc.state.al.us/InmateSearch' },
  AR: { link: 'https://corrections.az.gov/public-resources/inmate-datasearch' },
  AS: { link: '' },
  AZ: { link: 'https://corrections.az.gov/public-resources/inmate-datasearch' },
  CA: { link: 'https://inmatelocator.cdcr.ca.gov/search.aspx' },
  CO: { link: 'http://www.doc.state.co.us/oss/' },
  CT: { link: 'http://www.ctinmateinfo.state.ct.us/searchop.asp' },
  DC: { link: '' },
  DE: { link: '' },
  FL: { link: 'http://www.dc.state.fl.us/OffenderSearch/Search.aspx' },
  GA: {
    link:
      'http://www.dcor.state.ga.us/GDC/OffenderQuery/jsp/OffQryForm.jsp?Institution=',
  },
  GU: { link: '' },
  HI: { link: '' },
  IA: { link: 'https://doc.iowa.gov/offender/search' },
  ID: { link: 'https://www.idoc.idaho.gov/content/prisons/offender_search' },
  IL: {
    link: 'https://www2.illinois.gov/idoc/offender/pages/inmatesearch.aspx',
  },
  IN: { link: 'https://www.in.gov/apps/indcorrection/ofs/ofs' },
  KS: { link: 'https://kdocrepository.doc.ks.gov/kasper/' },
  KY: { link: 'http://kool.corrections.ky.gov/' },
  LA: { link: '' },
  MA: { link: '' },
  MD: { link: 'http://www.dpscs.state.md.us/inmate/' },
  ME: {
    link:
      'https://www1.maine.gov/cgi-bin/online/mdoc/search-and-deposit/search.pl?Search=Continue',
  },
  MI: { link: 'http://mdocweb.state.mi.us/OTIS2/otis2.aspx' },
  MN: { link: 'https://coms.doc.state.mn.us/PublicViewer' },
  MO: { link: 'https://web.mo.gov/doc/offSearchWeb/welcome.do' },
  MS: { link: 'https://www.ms.gov/mdoc/inmate' },
  MT: { link: 'https://app.mt.gov/conweb/' },
  NC: {
    link: 'https://webapps.doc.state.nc.us/opi/offendersearch.do?method=view',
  },
  ND: { link: 'http://www.nd.gov/docr/offenderlkup/index.asp' },
  NE: { link: 'http://dcs-inmatesearch.ne.gov/Corrections/COR_input.html' },
  NH: { link: 'http://business.nh.gov/inmate_locator/' },
  NJ: { link: 'https://www20.state.nj.us/DOC_Inmate/inmatesearch' },
  NM: { link: 'http://search.cd.nm.gov/' },
  NV: { link: 'http://167.154.2.76/inmatesearch/form.php' },
  NY: { link: 'http://nysdoccslookup.doccs.ny.gov/' },
  OH: { link: 'https://appgateway.drc.ohio.gov/OffenderSearch' },
  OK: { link: 'https://okoffender.doc.ok.gov/' },
  OR: { link: 'http://docpub.state.or.us/OOS/searchCriteria.jsf' },
  PA: { link: 'http://inmatelocator.cor.pa.gov/#/' },
  PR: { link: '' },
  RI: { link: 'http://www.doc.ri.gov/inmate_search/search.php' },
  SC: { link: 'http://public.doc.state.sc.us/scdc-public/' },
  SD: { link: 'https://doc.sd.gov/adult/lookup/' },
  TN: { link: 'https://apps.tn.gov/foil-app/results.jsp' },
  TX: { link: 'https://offender.tdcj.texas.gov/OffenderSearch/index.jsp' },
  UT: { link: 'https://corrections.utah.gov/index.php/2014-10-30-20-13-59' },
  VA: { link: 'https://vadoc.virginia.gov/offenders/locator/index.aspx' },
  VI: { link: '' },
  VT: {
    link:
      'https://omsweb.public-safety-cloud.com/jtclientweb/(S(w42wllbjj4dtbxy4gvmfk4q4))/jailtracker/index/Vermont',
  },
  WA: { link: 'https://www.doc.wa.gov/information/inmate-search/default.aspx' },
  WI: { link: 'https://appsdoc.wi.gov/lop/home.do' },
  WV: { link: 'https://apps.wv.gov/ois/offendersearch/doc' },
  WY: { link: 'http://wdoc-loc.wyo.gov/' },
};

// [
//   {
//     "State": "Federal BOP",
//     "minilink": "https://bit.ly/1l4mr5B",
//     "Web Site Name": "https://www.bop.gov/inmateloc/",
//     "": "",
//     "# of Estimated inmates": "178,688"
//   },
//   {
//     "State": "Alabama",
//     "minilink": "http://bit.ly/2pknsgX",
//     "Web Site Name": "http://www.doc.state.al.us/InmateSearch",
//     "": "",
//     "# of Estimated inmates": "29,762"
//   },
//   {
//     "State": "Arizona",
//     "minilink": "http://bit.ly/1EjfIfJ",
//     "Web Site Name": "https://corrections.az.gov/public-resources/inmate-datasearch",
//     "": "",
//     "# of Estimated inmates": "40,952"
//   },
//   {
//     "State": "Arkansas",
//     "minilink": "http://bit.ly/1T4uhI0",
//     "Web Site Name": "https://apps.ark.org/inmate_info/index.php",
//     "": "",
//     "# of Estimated inmates": "17,656"
//   },
//   {
//     "State": "California",
//     "minilink": "http://bit.ly/1eWS3Bt",
//     "Web Site Name": "https://inmatelocator.cdcr.ca.gov/search.aspx",
//     "": "",
//     "# of Estimated inmates": "129,205"
//   },
//   {
//     "State": "Colorado",
//     "minilink": "http://bit.ly/2qZSibf",
//     "Web Site Name": "http://www.doc.state.co.us/oss/",
//     "": "",
//     "# of Estimated inmates": "20,041"
//   },
//   {
//     "State": "Connecticut",
//     "minilink": "http://bit.ly/2pyYwhX",
//     "Web Site Name": "http://www.ctinmateinfo.state.ct.us/searchop.asp",
//     "": "",
//     "# of Estimated inmates": "11,220"
//   },
//   {
//     "State": "Florida",
//     "minilink": "https://bit.ly/2AVYqcc",
//     "Web Site Name": "http://www.dc.state.fl.us/OffenderSearch/Search.aspx",
//     "": "",
//     "# of Estimated inmates": "101,424"
//   },
//   {
//     "State": "Georgia",
//     "minilink": "http://bit.ly/2q2Kt6N",
//     "Web Site Name": "http://www.dcor.state.ga.us/GDC/OffenderQuery/jsp/OffQryForm.jsp?Institution=",
//     "": "",
//     "# of Estimated inmates": "51,700"
//   },
//   {
//     "State": "Idaho",
//     "minilink": "http://bit.ly/2pjV3rk",
//     "Web Site Name": "https://www.idoc.idaho.gov/content/prisons/offender_search",
//     "": "",
//     "# of Estimated inmates": "7,255"
//   },
//   {
//     "State": "Illinois",
//     "minilink": "http://bit.ly/2pwrL4a",
//     "Web Site Name": "https://www2.illinois.gov/idoc/offender/pages/inmatesearch.aspx",
//     "": "",
//     "# of Estimated inmates": "46,240"
//   },
//   {
//     "State": "Indiana",
//     "minilink": "http://bit.ly/2q5LvgO",
//     "Web Site Name": "https://www.in.gov/apps/indcorrection/ofs/ofs",
//     "": "",
//     "# of Estimated inmates": "27,334"
//   },
//   {
//     "State": "Iowa",
//     "minilink": "http://bit.ly/2pyJg4I",
//     "Web Site Name": "https://doc.iowa.gov/offender/search",
//     "": "",
//     "# of Estimated inmates": "8,816"
//   },
//   {
//     "State": "Kansas",
//     "minilink": "http://bit.ly/2qT6mXE",
//     "Web Site Name": "https://kdocrepository.doc.ks.gov/kasper/",
//     "": "",
//     "# of Estimated inmates": "9,578"
//   },
//   {
//     "State": "Kentucky",
//     "minilink": "http://bit.ly/2r1Ccys",
//     "Web Site Name": "http://kool.corrections.ky.gov/",
//     "": "",
//     "# of Estimated inmates": "21,697"
//   },
//   {
//     "State": "Maine",
//     "minilink": "https://bit.ly/2vqYzl0",
//     "Web Site Name": "https://www1.maine.gov/cgi-bin/online/mdoc/search-and-deposit/search.pl?Search=Continue",
//     "": "",
//     "# of Estimated inmates": "21,697"
//   },
//   {
//     "State": "Maryland",
//     "minilink": "http://bit.ly/2qZAZXQ",
//     "Web Site Name": "http://www.dpscs.state.md.us/inmate/",
//     "": "",
//     "# of Estimated inmates": "20,408"
//   },
//   {
//     "State": "Michigan",
//     "minilink": "http://bit.ly/2r1mO5b",
//     "Web Site Name": "http://mdocweb.state.mi.us/OTIS2/otis2.aspx",
//     "": "",
//     "# of Estimated inmates": "42,628"
//   },
//   {
//     "State": "Minnesota",
//     "minilink": "http://bit.ly/2pjVyl3",
//     "Web Site Name": "https://coms.doc.state.mn.us/PublicViewer",
//     "": "",
//     "# of Estimated inmates": "10,798"
//   },
//   {
//     "State": "Mississippi",
//     "minilink": "http://bit.ly/2pwmBVC",
//     "Web Site Name": "https://www.ms.gov/mdoc/inmate",
//     "": "",
//     "# of Estimated inmates": "18,236"
//   },
//   {
//     "State": "Missouri",
//     "minilink": "https://bit.ly/2q2NGmP",
//     "Web Site Name": "https://web.mo.gov/doc/offSearchWeb/welcome.do",
//     "": "",
//     "# of Estimated inmates": "32,328"
//   },
//   {
//     "State": "Montana",
//     "minilink": "http://bit.ly/2pwQogO",
//     "Web Site Name": "https://app.mt.gov/conweb/",
//     "": "",
//     "# of Estimated inmates": "3,685"
//   },
//   {
//     "State": "Nebraska",
//     "minilink": "http://bit.ly/2q5Fzo1",
//     "Web Site Name": "http://dcs-inmatesearch.ne.gov/Corrections/COR_input.html",
//     "": "",
//     "# of Estimated inmates": "5,312"
//   },
//   {
//     "State": "Nevada",
//     "minilink": "http://bit.ly/1VdkCDF",
//     "Web Site Name": "http://167.154.2.76/inmatesearch/form.php",
//     "": "",
//     "# of Estimated inmates": "12,944"
//   },
//   {
//     "State": "New Hampshire",
//     "minilink": "http://bit.ly/2qrf5QG",
//     "Web Site Name": "http://business.nh.gov/inmate_locator/",
//     "": "",
//     "# of Estimated inmates": "2,897"
//   },
//   {
//     "State": "New Jersey",
//     "minilink": "https://bit.ly/2JRC3HF",
//     "Web Site Name": "https://www20.state.nj.us/DOC_Inmate/inmatesearch",
//     "": "",
//     "# of Estimated inmates": "20,489"
//   },
//   {
//     "State": "New Mexico",
//     "minilink": "http://bit.ly/2q5p9fp",
//     "Web Site Name": "http://search.cd.nm.gov/",
//     "": "",
//     "# of Estimated inmates": "6,994"
//   },
//   {
//     "State": "New York",
//     "minilink": "http://on.ny.gov/2fzggci",
//     "Web Site Name": "http://nysdoccslookup.doccs.ny.gov/",
//     "": "",
//     "# of Estimated inmates": "51,606"
//   },
//   {
//     "State": "North Carolina",
//     "minilink": "http://bit.ly/2r1VNPc",
//     "Web Site Name": "https://webapps.doc.state.nc.us/opi/offendersearch.do?method=view",
//     "": "",
//     "# of Estimated inmates": "35,523"
//   },
//   {
//     "State": "North Dakota",
//     "minilink": "http://bit.ly/2pjZpi3",
//     "Web Site Name": "http://www.nd.gov/docr/offenderlkup/index.asp",
//     "": "",
//     "# of Estimated inmates": "1,783"
//   },
//   {
//     "State": "Ohio",
//     "minilink": "https://bit.ly/2hWH1bR",
//     "Web Site Name": "https://appgateway.drc.ohio.gov/OffenderSearch",
//     "": "",
//     "# of Estimated inmates": "52,233"
//   },
//   {
//     "State": "Oklahoma",
//     "minilink": "http://bit.ly/2q2EHC2",
//     "Web Site Name": "https://okoffender.doc.ok.gov/",
//     "": "",
//     "# of Estimated inmates": "28,114"
//   },
//   {
//     "State": "Oregon",
//     "minilink": "https://bit.ly/2Qfcwu9",
//     "Web Site Name": "http://docpub.state.or.us/OOS/searchCriteria.jsf",
//     "": "",
//     "# of Estimated inmates": "15,230"
//   },
//   {
//     "State": "Pennsylvania",
//     "minilink": "http://bit.ly/2pzpsOl",
//     "Web Site Name": "http://inmatelocator.cor.pa.gov/#/",
//     "": "",
//     "# of Estimated inmates": "49,578"
//   },
//   {
//     "State": "Rhode Island",
//     "minilink": "http://bit.ly/2pzedW5",
//     "Web Site Name": "http://www.doc.ri.gov/inmate_search/search.php",
//     "": "",
//     "# of Estimated inmates": "2,156"
//   },
//   {
//     "State": "South Carolina",
//     "minilink": "http://bit.ly/2pwi7hU",
//     "Web Site Name": "http://public.doc.state.sc.us/scdc-public/",
//     "": "",
//     "# of Estimated inmates": "20,392"
//   },
//   {
//     "State": "South Dakota",
//     "minilink": "http://bit.ly/2q33nL4",
//     "Web Site Name": "https://doc.sd.gov/adult/lookup/",
//     "": "",
//     "# of Estimated inmates": "3,558"
//   },
//   {
//     "State": "Tennesse",
//     "minilink": "http://bit.ly/2qT1sK8",
//     "Web Site Name": "https://apps.tn.gov/foil-app/results.jsp",
//     "": "",
//     "# of Estimated inmates": "28,172"
//   },
//   {
//     "State": "Texas",
//     "minilink": "http://bit.ly/2qrnNyt",
//     "Web Site Name": "https://offender.tdcj.texas.gov/OffenderSearch/index.jsp",
//     "": "",
//     "# of Estimated inmates": "157,251"
//   },
//   {
//     "State": "Utah",
//     "minilink": "http://bit.ly/2q5JpgK",
//     "Web Site Name": "https://corrections.utah.gov/index.php/2014-10-30-20-13-59",
//     "": "",
//     "# of Estimated inmates": "6,488"
//   },
//   {
//     "State": "Vermont",
//     "minilink": "http://bit.ly/2qriMGf",
//     "Web Site Name": "https://omsweb.public-safety-cloud.com/jtclientweb/(S(w42wllbjj4dtbxy4gvmfk4q4))/jailtracker/index/Vermont",
//     "": "",
//     "# of Estimated inmates": "1,290"
//   },
//   {
//     "State": "Virginia",
//     "minilink": "http://bit.ly/2pwJTe8",
//     "Web Site Name": "https://vadoc.virginia.gov/offenders/locator/index.aspx",
//     "": "",
//     "# of Estimated inmates": "38,403"
//   },
//   {
//     "State": "Washington",
//     "minilink": "http://bit.ly/2pz3ds2",
//     "Web Site Name": "https://www.doc.wa.gov/information/inmate-search/default.aspx",
//     "": "",
//     "# of Estimated inmates": "18,205"
//   },
//   {
//     "State": "West Virginia",
//     "minilink": "https://bit.ly/2qYc0Gi",
//     "Web Site Name": "https://apps.wv.gov/ois/offendersearch/doc",
//     "": "",
//     "# of Estimated inmates": "7,118"
//   },
//   {
//     "State": "Wisconsin",
//     "minilink": "http://bit.ly/2qT6hmv",
//     "Web Site Name": "https://appsdoc.wi.gov/lop/home.do",
//     "": "",
//     "# of Estimated inmates": "21,763"
//   },
//   {
//     "State": "Wyoming",
//     "minilink": "http://bit.ly/2q5KaXc",
//     "Web Site Name": "http://wdoc-loc.wyo.gov/",
//     "": "",
//     "# of Estimated inmates": "2,424"
//   },
//   {
//     "State": "",
//     "minilink": "",
//     "Web Site Name": "",
//     "": "",
//     "# of Estimated inmates": ""
//   },
//   {
//     "State": "Alaska",
//     "minilink": "No public inmate database",
//     "Web Site Name": "",
//     "": "",
//     "# of Estimated inmates": "2,261"
//   },
//   {
//     "State": "Delaware",
//     "minilink": "No public inmate database",
//     "Web Site Name": "",
//     "": "",
//     "# of Estimated inmates": "4,188"
//   },
//   {
//     "State": "Hawaii",
//     "minilink": "No public inmate database",
//     "Web Site Name": "",
//     "": "",
//     "# of Estimated inmates": "3,769"
//   },
//   {
//     "State": "Louisiana",
//     "minilink": "No public inmate database",
//     "Web Site Name": "",
//     "": "",
//     "# of Estimated inmates": "36,347"
//   },
//   {
//     "State": "Massachusetts",
//     "minilink": "No public inmate database",
//     "Web Site Name": "",
//     "": "",
//     "# of Estimated inmates": "8,954"
//   }
