"""
Generated Moose models and pipelines.
This file was automatically generated from database metadata.
"""

from typing import Optional
from datetime import datetime
from moose_lib import BaseModel, Key, Field, OlapTable, OlapConfig

from moose_lib_extras import (
    # Base model
    SapHanaBaseModel,
    
    # Datetime types
    SapDate, SapTime, SapSecondDate, SapTimestamp,
    
    # Numeric types
    SapTinyInt, SapSmallInt, SapInteger, SapBigInt,
    SapSmallDecimal, SapDecimal, SapReal, SapDouble,
    
    # Boolean type
    SapBoolean,
    
    # Character string types
    SapVarchar, SapNvarchar, SapAlphanum, SapShortText,
    
    # Binary types
    SapVarbinary,
    
    # Large Object types
    SapBlob, SapClob, SapNclob, SapText,
    
    # Multi-valued types
    SapArray,
    
    # Spatial types
    SapStGeometry, SapStPoint,
)

class Adrc(SapHanaBaseModel):
    """
    Model for SAP HANA table: ADRC
    Schema: SAPHANADB
    """

    # SAP HANA type: NVARCHAR | Primary key | Order by field
    CLIENT: Key[SapNvarchar]
    # SAP HANA type: NVARCHAR | Primary key
    ADDRNUMBER: Key[SapNvarchar]
    # SAP HANA type: NVARCHAR | Primary key
    DATE_FROM: Key[SapNvarchar]
    # SAP HANA type: NVARCHAR | Primary key
    NATION: Key[SapNvarchar]
    # SAP HANA type: NVARCHAR | Forced nullable
    DATE_TO: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    TITLE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    NAME1: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    NAME2: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    NAME3: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    NAME4: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    NAME_TEXT: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    NAME_CO: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    CITY1: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    CITY2: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    CITY_CODE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    CITYP_CODE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    HOME_CITY: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    CITYH_CODE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    CHCKSTATUS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    REGIOGROUP: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    POST_CODE1: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    POST_CODE2: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    POST_CODE3: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PCODE1_EXT: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PCODE2_EXT: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PCODE3_EXT: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PO_BOX: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    DONT_USE_P: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PO_BOX_NUM: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PO_BOX_LOC: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    CITY_CODE2: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PO_BOX_REG: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PO_BOX_CTY: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    POSTALAREA: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    TRANSPZONE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    STREET: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    DONT_USE_S: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    STREETCODE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    STREETABBR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    HOUSE_NUM1: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    HOUSE_NUM2: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    HOUSE_NUM3: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    STR_SUPPL1: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    STR_SUPPL2: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    STR_SUPPL3: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    LOCATION: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    BUILDING: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FLOOR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ROOMNUMBER: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    COUNTRY: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    LANGU: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    REGION: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ADDR_GROUP: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FLAGGROUPS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PERS_ADDR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SORT1: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SORT2: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SORT_PHN: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    DEFLT_COMM: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    TEL_NUMBER: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    TEL_EXTENS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FAX_NUMBER: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FAX_EXTENS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FLAGCOMM2: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FLAGCOMM3: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FLAGCOMM4: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FLAGCOMM5: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FLAGCOMM6: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FLAGCOMM7: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FLAGCOMM8: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FLAGCOMM9: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FLAGCOMM10: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FLAGCOMM11: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FLAGCOMM12: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FLAGCOMM13: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ADDRORIGIN: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    MC_NAME1: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    MC_CITY1: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    MC_STREET: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    EXTENSION1: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    EXTENSION2: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Order by field
    TIME_ZONE: SapNvarchar
    # SAP HANA type: NVARCHAR | Forced nullable
    TAXJURCODE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ADDRESS_ID: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    LANGU_CREA: Optional[SapNvarchar] = ""
    # SAP HANA type: VARBINARY | Nullable
    ADRC_UUID: Optional[SapVarbinary] = 00000000000000000000000000000000
    # SAP HANA type: NVARCHAR | Forced nullable
    UUID_BELATED: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ID_CATEGORY: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ADRC_ERR_STATUS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PO_BOX_LOBBY: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    DELI_SERV_TYPE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    DELI_SERV_NUMBER: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    COUNTY_CODE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    COUNTY: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    TOWNSHIP_CODE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    TOWNSHIP: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    MC_COUNTY: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    MC_TOWNSHIP: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    XPCPT: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    DATAAGING: Optional[SapNvarchar] = Field(alias="_DATAAGING", default=00000000)
    # SAP HANA type: NVARCHAR | Forced nullable
    ADDRESSCREATEDBYUSER: Optional[SapNvarchar] = ""
    # SAP HANA type: TIMESTAMP | Order by field
    ADDRESSCREATEDONDATETIME: SapTimestamp
    # SAP HANA type: NVARCHAR | Forced nullable
    ADDRESSCHANGEDBYUSER: Optional[SapNvarchar] = ""
    # SAP HANA type: TIMESTAMP | Forced nullable
    ADDRESSCHANGEDONDATETIME: Optional[SapTimestamp] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    DUNS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    DUNSP4: Optional[SapNvarchar] = ""

class Adrv(SapHanaBaseModel):
    """
    Model for SAP HANA table: ADRV
    Schema: SAPHANADB
    """

    # SAP HANA type: NVARCHAR | Primary key | Order by field
    CLIENT: Key[SapNvarchar]
    # SAP HANA type: NVARCHAR | Primary key | Order by field
    ADDRNUMBER: Key[SapNvarchar]
    # SAP HANA type: NVARCHAR | Primary key
    CONSNUMBER: Key[SapNvarchar]
    # SAP HANA type: NVARCHAR | Forced nullable
    APPL_TABLE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    APPL_FIELD: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    APPL_KEY: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ADDR_GROUP: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    OWNER: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    DATAAGING: Optional[SapNvarchar] = Field(alias="_DATAAGING", default=00000000)

class Aeoi(SapHanaBaseModel):
    """
    Model for SAP HANA table: AEOI
    Schema: SAPHANADB
    """

    # SAP HANA type: NVARCHAR | Primary key | Order by field
    MANDT: Key[SapNvarchar]
    # SAP HANA type: NVARCHAR | Primary key | Order by field
    AENNR: Key[SapNvarchar]
    # SAP HANA type: NVARCHAR | Primary key
    AETYP: Key[SapNvarchar]
    # SAP HANA type: NVARCHAR | Primary key
    OBJKT: Key[SapNvarchar]
    # SAP HANA type: NVARCHAR | Forced nullable
    USOBJ: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    CCVMS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    OITXT: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    LTXSP: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    AEDAT: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    AENAM: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ANDAT: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    ANNAM: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    OBJDT: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    OBJNM: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    CCLCK: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    AEOST: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    REVLV: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    AEDTZ: Optional[SapNvarchar] = 000
    # SAP HANA type: NVARCHAR | Forced nullable
    CCSTO: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    CCOAA: Optional[SapNvarchar] = 000
    # SAP HANA type: NVARCHAR | Forced nullable
    CONT1: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    AEOI_GUID: Optional[SapNvarchar] = ""

class Afko(SapHanaBaseModel):
    """
    Model for SAP HANA table: AFKO
    Schema: SAPHANADB
    """

    # SAP HANA type: NVARCHAR | Primary key | Order by field
    MANDT: Key[SapNvarchar]
    # SAP HANA type: NVARCHAR | Primary key | Order by field
    AUFNR: Key[SapNvarchar]
    # SAP HANA type: NVARCHAR | Forced nullable
    GLTRP: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    GSTRP: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    FTRMS: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    GLTRS: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    GSTRS: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    GSTRI: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    GETRI: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    GLTRI: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    FTRMI: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    FTRMP: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    RSNUM: Optional[SapNvarchar] = 0000000000
    # SAP HANA type: DECIMAL | Forced nullable
    GASMG: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    GAMNG: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    GMEIN: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PLNBEZ: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PLNTY: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PLNNR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PLNAW: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PLNAL: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PVERW: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PLAUF: Optional[SapNvarchar] = 00000000
    # SAP HANA type: DECIMAL | Forced nullable
    PLSVB: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    PLNME: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    PLSVN: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    PDATV: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    PAENR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PLGRP: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    LODIV: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    STLTY: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    STLBEZ: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    STLST: Optional[SapNvarchar] = 00
    # SAP HANA type: NVARCHAR | Forced nullable
    STLNR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SDATV: Optional[SapNvarchar] = 00000000
    # SAP HANA type: DECIMAL | Forced nullable
    SBMNG: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    SBMEH: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SAENR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    STLAL: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    STLAN: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    SLSVN: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    SLSBS: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    AUFLD: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    DISPO: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    AUFPL: Optional[SapNvarchar] = 0000000000
    # SAP HANA type: NVARCHAR | Forced nullable
    FEVOR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FHORI: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    TERKZ: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    REDKZ: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    APRIO: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    NTZUE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    VORUE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PROFID: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    VORGZ: Optional[SapNvarchar] = 000
    # SAP HANA type: NVARCHAR | Forced nullable
    SICHZ: Optional[SapNvarchar] = 000
    # SAP HANA type: NVARCHAR | Forced nullable
    FREIZ: Optional[SapNvarchar] = 000
    # SAP HANA type: NVARCHAR | Forced nullable
    UPTER: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    BEDID: Optional[SapNvarchar] = 000000000000
    # SAP HANA type: NVARCHAR | Forced nullable
    PRONR: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    ZAEHL: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    MZAEHL: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    ZKRIZ: Optional[SapNvarchar] = 0000000
    # SAP HANA type: NVARCHAR | Forced nullable
    PRUEFLOS: Optional[SapNvarchar] = 000000000000
    # SAP HANA type: NVARCHAR | Forced nullable
    KLVARP: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KLVARI: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    RGEKZ: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PLART: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FLG_AOB: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FLG_ARBEI: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    GLTPP: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    GSTPP: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    GLTPS: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    GSTPS: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    FTRPS: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    RDKZP: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    TRKZP: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    RUECK: Optional[SapNvarchar] = 0000000000
    # SAP HANA type: NVARCHAR | Forced nullable
    RMZHL: Optional[SapNvarchar] = 00000000
    # SAP HANA type: DECIMAL | Forced nullable
    IGMNG: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    RATID: Optional[SapNvarchar] = 000000000000
    # SAP HANA type: NVARCHAR | Forced nullable
    GROID: Optional[SapNvarchar] = 000000000000
    # SAP HANA type: NVARCHAR | Forced nullable
    CUOBJ: Optional[SapNvarchar] = 000000000000000000
    # SAP HANA type: NVARCHAR | Forced nullable
    GLUZS: Optional[SapNvarchar] = 000000
    # SAP HANA type: NVARCHAR | Forced nullable
    GSUZS: Optional[SapNvarchar] = 000000
    # SAP HANA type: NVARCHAR | Forced nullable
    REVLV: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    RSHTY: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    RSHID: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    RSNTY: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    RSNID: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    NAUTERM: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    NAUCOST: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    STUFE: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    WEGXX: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    VWEGX: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    ARSNR: Optional[SapNvarchar] = 0000000000
    # SAP HANA type: NVARCHAR | Forced nullable
    ARSPS: Optional[SapNvarchar] = 0000
    # SAP HANA type: NVARCHAR | Forced nullable
    MAUFNR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    LKNOT: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    RKNOT: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PRODNET: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    IASMG: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    ABARB: Optional[SapNvarchar] = 000
    # SAP HANA type: NVARCHAR | Forced nullable
    AUFNT: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    AUFPT: Optional[SapNvarchar] = 0000000000
    # SAP HANA type: NVARCHAR | Forced nullable
    APLZT: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    NO_DISP: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    CSPLIT: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    AENNR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    CY_SEQNR: Optional[SapNvarchar] = 00000000000000
    # SAP HANA type: NVARCHAR | Forced nullable
    BREAKS: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    VORGZ_TRM: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    SICHZ_TRM: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    TRMDT: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    GLUZP: Optional[SapNvarchar] = 000000
    # SAP HANA type: NVARCHAR | Forced nullable
    GSUZP: Optional[SapNvarchar] = 000000
    # SAP HANA type: NVARCHAR | Forced nullable
    GSUZI: Optional[SapNvarchar] = 000000
    # SAP HANA type: NVARCHAR | Forced nullable
    GEUZI: Optional[SapNvarchar] = 000000
    # SAP HANA type: NVARCHAR | Forced nullable
    GLUPP: Optional[SapNvarchar] = 000000
    # SAP HANA type: NVARCHAR | Forced nullable
    GSUPP: Optional[SapNvarchar] = 000000
    # SAP HANA type: NVARCHAR | Forced nullable
    GLUPS: Optional[SapNvarchar] = 000000
    # SAP HANA type: NVARCHAR | Forced nullable
    GSUPS: Optional[SapNvarchar] = 000000
    # SAP HANA type: NVARCHAR | Forced nullable
    CHSCH: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KAPT_VORGZ: Optional[SapNvarchar] = 000
    # SAP HANA type: NVARCHAR | Forced nullable
    KAPT_SICHZ: Optional[SapNvarchar] = 000
    # SAP HANA type: NVARCHAR | Forced nullable
    LEAD_AUFNR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PNETSTARTD: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    PNETSTARTT: Optional[SapNvarchar] = 000000
    # SAP HANA type: NVARCHAR | Forced nullable
    PNETENDD: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    PNETENDT: Optional[SapNvarchar] = 000000
    # SAP HANA type: NVARCHAR | Forced nullable
    KBED: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KKALKR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SFCPF: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    RMNGA: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    GSBTR: Optional[SapNvarchar] = 00000000
    # SAP HANA type: DECIMAL | Forced nullable
    VFMNG: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    NOPCOST: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    NETZKONT: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ATRKZ: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    OBJTYPE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    CH_PROC: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KAPVERSA: Optional[SapNvarchar] = 00
    # SAP HANA type: NVARCHAR | Forced nullable
    COLORDPROC: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KZERB: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    CONF_KEY: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    ST_ARBID: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    VSNMR_V: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    TERHW: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SPLSTAT: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    COSTUPD: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    MAX_GAMNG: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    MES_ROUTINGID: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    TL_VERSN: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    BOM_VERSN: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FLEXIBLE_PROCESSING: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ADPSP: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    RMANR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    POSNR_RMA: Optional[SapNvarchar] = 000000
    # SAP HANA type: NVARCHAR | Forced nullable
    POSNV_RMA: Optional[SapNvarchar] = 000000
    # SAP HANA type: DECIMAL | Forced nullable
    CFB_MAXLZ: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    CFB_LZEIH: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    CFB_ADTDAYS: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    CFB_DATOFM: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    CFB_BBDPI: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    OIHANTYP: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FSH_MPROD_ORD: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FLG_BUNDLE: Optional[SapNvarchar] = ""
    # SAP HANA type: INTEGER | Forced nullable
    MILL_RATIO: Optional[SapInteger] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    BMEINS: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    BMENGE: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    MILL_OC_ZUSKZ: Optional[SapNvarchar] = ""

class Afpo(SapHanaBaseModel):
    """
    Model for SAP HANA table: AFPO
    Schema: SAPHANADB
    """

    # SAP HANA type: NVARCHAR | Primary key | Order by field
    MANDT: Key[SapNvarchar]
    # SAP HANA type: NVARCHAR | Primary key | Order by field
    AUFNR: Key[SapNvarchar]
    # SAP HANA type: NVARCHAR | Primary key
    POSNR: Key[SapNvarchar]
    # SAP HANA type: NVARCHAR | Forced nullable
    PSOBS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    QUNUM: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    QUPOS: Optional[SapNvarchar] = 000
    # SAP HANA type: NVARCHAR | Forced nullable
    PROJN: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    PLNUM: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    STRMP: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    ETRMP: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    KDAUF: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KDPOS: Optional[SapNvarchar] = 000000
    # SAP HANA type: NVARCHAR | Forced nullable
    KDEIN: Optional[SapNvarchar] = 0000
    # SAP HANA type: NVARCHAR | Forced nullable
    BESKZ: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    PSAMG: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    PSMNG: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    WEMNG: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    IAMNG: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    AMEIN: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    MEINS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    MATNR: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    PAMNG: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    PGMNG: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    KNTTP: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    TPAUF: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    LTRMI: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    LTRMP: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    KALNR: Optional[SapNvarchar] = 000000000000
    # SAP HANA type: DECIMAL | Forced nullable
    UEBTO: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    UEBTK: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    UNTTO: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    INSMK: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    WEPOS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    BWTAR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    BWTTY: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PWERK: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    LGORT: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    UMREZ: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    UMREN: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    WEBAZ: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    ELIKZ: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SAFNR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    VERID: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SERNR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    TECHS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    DWERK: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    DAUTY: Optional[SapNvarchar] = 00
    # SAP HANA type: NVARCHAR | Forced nullable
    DAUAT: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    DGLTP: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    DGLTS: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    DFREI: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    DNREL: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    VERTO: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SOBKZ: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KZVBR: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    WEWRT: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    WEUNB: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ABLAD: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    WEMPF: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    CHARG: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    GSBER: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    WEAED: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    CUOBJ: Optional[SapNvarchar] = 000000000000000000
    # SAP HANA type: NVARCHAR | Forced nullable
    KBNKZ: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ARSNR: Optional[SapNvarchar] = 0000000000
    # SAP HANA type: NVARCHAR | Forced nullable
    ARSPS: Optional[SapNvarchar] = 0000
    # SAP HANA type: NVARCHAR | Forced nullable
    KRSNR: Optional[SapNvarchar] = 0000000000
    # SAP HANA type: NVARCHAR | Forced nullable
    KRSPS: Optional[SapNvarchar] = 0000
    # SAP HANA type: NVARCHAR | Forced nullable
    KCKEY: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    RTP01: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    RTP02: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    RTP03: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    RTP04: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KSVON: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    KSBIS: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    OBJNP: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    NDISR: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    VFMNG: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    GSBTR: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    KZAVC: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KZBWS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    XLOEK: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SERNP: Optional[SapNvarchar] = ""
    # SAP HANA type: INTEGER | Forced nullable
    ANZSN: Optional[SapInteger] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    OBJTYPE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    CH_PROC: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FXPRU: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    CUOBJ_ROOT: Optional[SapNvarchar] = 000000000000000000
    # SAP HANA type: NVARCHAR | Forced nullable
    BERID: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    TECHS_COPY: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SGT_SCAT: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KUNNR2: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FSH_SEASON_YEAR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FSH_SEASON: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FSH_COLLECTION: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FSH_THEME: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    FSH_SALLOC_QTY: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    MILL_OC_AUFNR_U: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    MILL_OC_RUMNG: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    MILL_OC_SORT: Optional[SapNvarchar] = 00000000

class Afvc(SapHanaBaseModel):
    """
    Model for SAP HANA table: AFVC
    Schema: SAPHANADB
    """

    # SAP HANA type: NVARCHAR | Primary key | Order by field
    MANDT: Key[SapNvarchar]
    # SAP HANA type: NVARCHAR | Primary key | Order by field
    AUFPL: Key[SapNvarchar]
    # SAP HANA type: NVARCHAR | Primary key
    APLZL: Key[SapNvarchar]
    # SAP HANA type: NVARCHAR | Forced nullable
    PLNFL: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PLNKN: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    PLNAL: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PLNTY: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    VINTV: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    PLNNR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ZAEHL: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    VORNR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    STEUS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ARBID: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    PDEST: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    WERKS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KTSCH: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    LTXA1: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    LTXA2: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    TXTSP: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    VPLTY: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    VPLNR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    VPLAL: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    VPLFL: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    VGWTS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    LAR01: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    LAR02: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    LAR03: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    LAR04: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    LAR05: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    LAR06: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ZERMA: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ZGDAT: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ZCODE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ZULNR: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    LOANZ: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    LOART: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    RSANZ: Optional[SapNvarchar] = 000
    # SAP HANA type: NVARCHAR | Forced nullable
    QUALF: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    ANZMA: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    RFGRP: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    RFSCH: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    RASCH: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    AUFAK: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    LOGRP: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    UEMUS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    UEKAN: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FLIES: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SPMUS: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    SPLIM: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    ABLIPKZ: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    RSTRA: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SUMNR: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    SORTL: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    LIFNR: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    PREIS: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    PEINH: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    SAKTO: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    WAERS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    INFNR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ESOKZ: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    EKORG: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    EKGRP: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KZLGF: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KZWRTF: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    MATKL: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    DDEHN: Optional[SapNvarchar] = ""
    # SAP HANA type: SMALLINT | Forced nullable
    ANZZL: Optional[SapSmallInt] = 0
    # SAP HANA type: SMALLINT | Forced nullable
    PRZNT: Optional[SapSmallInt] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    MLSTN: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PPRIO: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    BUKRS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ANFKO: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ANFKOKRS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    INDET: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    LARNT: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    PRKST: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    APLFL: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    RUECK: Optional[SapNvarchar] = 0000000000
    # SAP HANA type: NVARCHAR | Forced nullable
    RMZHL: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    PROJN: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    OBJNR: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    SPANZ: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    BEDID: Optional[SapNvarchar] = 000000000000
    # SAP HANA type: NVARCHAR | Forced nullable
    BEDZL: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    BANFN: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    BNFPO: Optional[SapNvarchar] = 00000
    # SAP HANA type: NVARCHAR | Forced nullable
    LEK01: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    LEK02: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    LEK03: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    LEK04: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    LEK05: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    LEK06: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SELKZ: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KALID: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FRSP: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    STDKN: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    ANLZU: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ISTRU: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ISTTY: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ISTNR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ISTKN: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    ISTPO: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    IUPOZ: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    EBORT: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    VERTL: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    LEKNW: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    NPRIO: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PVZKN: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    PHFLG: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PHSEQ: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KNOBJ: Optional[SapNvarchar] = 000000000000000000
    # SAP HANA type: NVARCHAR | Forced nullable
    ERFSICHT: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    QPPKTABS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    OTYPE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    OBJEKTID: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    QLKAPAR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    RSTUF: Optional[SapNvarchar] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    NPTXTKY: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SUBSYS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PSPNR: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    PACKNO: Optional[SapNvarchar] = 0000000000
    # SAP HANA type: NVARCHAR | Forced nullable
    TXJCD: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SCOPE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    GSBER: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PRCTR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    NO_DISP: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    QKZPRZEIT: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    QKZZTMG1: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    QKZPRMENG: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    QKZPRFREI: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KZFEAT: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    QKZTLSBEST: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    AENNR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    CUOBJ_ARB: Optional[SapNvarchar] = 000000000000000000
    # SAP HANA type: DECIMAL | Forced nullable
    EVGEW: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    ARBII: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    WERKI: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    CY_SEQNRV: Optional[SapNvarchar] = 00000000000000
    # SAP HANA type: INTEGER | Forced nullable
    KAPT_PUFFR: Optional[SapInteger] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    EBELN: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    EBELP: Optional[SapNvarchar] = 00000
    # SAP HANA type: NVARCHAR | Forced nullable
    WEMPF: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ABLAD: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    CLASF: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FRUNV: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ZSCHL: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KALSM: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SCHED_END: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    NETZKONT: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    OWAER: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    AFNAM: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    BEDNR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KZFIX: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PERNR: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    FRDLB: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    QPART: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    LOEKZ: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    WKURS: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    PROD_ACT: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FPLNR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    OBJTYPE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    CH_PROC: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KLVAR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KALNR: Optional[SapNvarchar] = 000000000000
    # SAP HANA type: NVARCHAR | Forced nullable
    FORDN: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FORDP: Optional[SapNvarchar] = 00000
    # SAP HANA type: DECIMAL | Forced nullable
    MAT_PRKST: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    PRZ01: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    RFPNT: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FUNC_AREA: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    TECHS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ADPSP: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    RFIPPNT: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    MES_OPERID: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    MES_STEPID: Optional[SapNvarchar] = ""
    # SAP HANA type: INTEGER | Forced nullable
    OAN_INST_ID_SETUP: Optional[SapInteger] = 0
    # SAP HANA type: INTEGER | Forced nullable
    OAN_INST_ID_PRODUCE: Optional[SapInteger] = 0
    # SAP HANA type: INTEGER | Forced nullable
    OAN_INST_ID_TEARDOWN: Optional[SapInteger] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    TL_VERSN: Optional[SapNvarchar] = ""
    # SAP HANA type: VARBINARY | Nullable
    VERSN_TRACK_GUID: Optional[SapVarbinary] = 00000000000000000000000000000000
    # SAP HANA type: NVARCHAR | Forced nullable
    MAINTORDOPPROCESSPHASECODE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    MAINTORDOPPROCESSSUBPHASECODE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    CL_TYPE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ALLMAINTORDCOMPCMTDQTSAREKEPT: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    DUMMY_EAM_AFVC_INCL_EEW_PS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    DUMMY_AFVC_INCL_EEW_PS: Optional[SapNvarchar] = ""
    # SAP HANA type: VARBINARY | Nullable
    CUM_CUGUID: Optional[SapVarbinary] = Field(alias="/CUM/CUGUID", default=00000000000000000000000000000000)
    # SAP HANA type: NVARCHAR | Forced nullable
    ISDFPS_OBJNR: Optional[SapNvarchar] = Field(alias="/ISDFPS/OBJNR", default="")
    # SAP HANA type: SMALLINT | Forced nullable
    AFVC_STATUS: Optional[SapSmallInt] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    ADRNR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ADRN2: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KUNN2: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    IND_ADR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FLDLOGSDELIVISHELDONSHORE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    MILL_OC_AUFNR_MO: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PS_ADRNR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PS_ADRN2: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PS_KUNNR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PS_EMLIF: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    WTY_IND: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    TPLNR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    EQUNR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    MAINTOPEXECUTIONPHASECODE: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    CPD_UPDAT: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    MAINTORDOPHASLEANSERVICES: Optional[SapNvarchar] = ""

class Afvv(SapHanaBaseModel):
    """
    Model for SAP HANA table: AFVV
    Schema: SAPHANADB
    """

    # SAP HANA type: NVARCHAR | Primary key | Order by field
    MANDT: Key[SapNvarchar]
    # SAP HANA type: NVARCHAR | Primary key | Order by field
    AUFPL: Key[SapNvarchar]
    # SAP HANA type: NVARCHAR | Primary key
    APLZL: Key[SapNvarchar]
    # SAP HANA type: NVARCHAR | Forced nullable
    MEINH: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    UMREN: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    UMREZ: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    BMSCH: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    ZMERH: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    ZEIER: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    VGE01: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    VGW01: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    VGE02: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    VGW02: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    VGE03: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    VGW03: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    VGE04: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    VGW04: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    VGE05: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    VGW05: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    VGE06: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    VGW06: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    ZEIMU: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    ZMINU: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    MINWE: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    ZEIMB: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    ZMINB: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    ZEILM: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    ZLMAX: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    ZEILP: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    ZLPRO: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    ZEIWN: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    ZWNOR: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    ZEIWM: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    ZWMIN: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    ZEITN: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    ZTNOR: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    ZEITM: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    ZTMIN: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    PLIFZ: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    DAUNO: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    DAUNE: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    DAUMI: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    DAUME: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    EINSA: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    EINSE: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    ARBEI: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    ARBEH: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    MGVRG: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    ASVRG: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    LMNGA: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    XMNGA: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    GMNGA: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    ISM01: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    ISM02: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    ISM03: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    ISM04: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    ISM05: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    ISM06: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    ISMNW: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    FSAVD: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    FSAVZ: Optional[SapNvarchar] = 000000
    # SAP HANA type: NVARCHAR | Forced nullable
    FSSBD: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    FSSBZ: Optional[SapNvarchar] = 000000
    # SAP HANA type: NVARCHAR | Forced nullable
    FSSAD: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    FSSAZ: Optional[SapNvarchar] = 000000
    # SAP HANA type: NVARCHAR | Forced nullable
    FSEDD: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    FSEDZ: Optional[SapNvarchar] = 000000
    # SAP HANA type: NVARCHAR | Forced nullable
    FSSLD: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    FSSLZ: Optional[SapNvarchar] = 000000
    # SAP HANA type: NVARCHAR | Forced nullable
    FSELD: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    FSELZ: Optional[SapNvarchar] = 000000
    # SAP HANA type: NVARCHAR | Forced nullable
    SSAVD: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    SSAVZ: Optional[SapNvarchar] = 000000
    # SAP HANA type: NVARCHAR | Forced nullable
    SSSBD: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    SSSBZ: Optional[SapNvarchar] = 000000
    # SAP HANA type: NVARCHAR | Forced nullable
    SSSAD: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    SSSAZ: Optional[SapNvarchar] = 000000
    # SAP HANA type: NVARCHAR | Forced nullable
    SSEDD: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    SSEDZ: Optional[SapNvarchar] = 000000
    # SAP HANA type: NVARCHAR | Forced nullable
    SSSLD: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    SSSLZ: Optional[SapNvarchar] = 000000
    # SAP HANA type: NVARCHAR | Forced nullable
    SSELD: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    SSELZ: Optional[SapNvarchar] = 000000
    # SAP HANA type: NVARCHAR | Forced nullable
    ISAVD: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    IEAVD: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    ISDD: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    ISDZ: Optional[SapNvarchar] = 000000
    # SAP HANA type: NVARCHAR | Forced nullable
    IERD: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    IERZ: Optional[SapNvarchar] = 000000
    # SAP HANA type: NVARCHAR | Forced nullable
    ISBD: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    ISBZ: Optional[SapNvarchar] = 000000
    # SAP HANA type: NVARCHAR | Forced nullable
    IEBD: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    IEBZ: Optional[SapNvarchar] = 000000
    # SAP HANA type: NVARCHAR | Forced nullable
    ISAD: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    ISAZ: Optional[SapNvarchar] = 000000
    # SAP HANA type: NVARCHAR | Forced nullable
    IEDD: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    IEDZ: Optional[SapNvarchar] = 000000
    # SAP HANA type: NVARCHAR | Forced nullable
    PEDD: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    PEDZ: Optional[SapNvarchar] = 000000
    # SAP HANA type: DECIMAL | Forced nullable
    PUFFR: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    PUFGS: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    NTANF: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    NTANZ: Optional[SapNvarchar] = 000000
    # SAP HANA type: NVARCHAR | Forced nullable
    NTEND: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    NTENZ: Optional[SapNvarchar] = 000000
    # SAP HANA type: NVARCHAR | Forced nullable
    EWSTD: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    EWSTZ: Optional[SapNvarchar] = 000000
    # SAP HANA type: NVARCHAR | Forced nullable
    EWEND: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    EWENZ: Optional[SapNvarchar] = 000000
    # SAP HANA type: DECIMAL | Forced nullable
    EWDAN: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    EWDNE: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    EWDAM: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    EWDME: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    EWSTE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    EWSTA: Optional[SapNvarchar] = ""
    # SAP HANA type: DOUBLE | Forced nullable
    WARTZ: Optional[SapDouble] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    WRTZE: Optional[SapNvarchar] = ""
    # SAP HANA type: DOUBLE | Forced nullable
    RUEST: Optional[SapDouble] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    RSTZE: Optional[SapNvarchar] = ""
    # SAP HANA type: DOUBLE | Forced nullable
    BEARZ: Optional[SapDouble] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    BEAZE: Optional[SapNvarchar] = ""
    # SAP HANA type: DOUBLE | Forced nullable
    ABRUE: Optional[SapDouble] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    ARUZE: Optional[SapNvarchar] = ""
    # SAP HANA type: DOUBLE | Forced nullable
    LIEGZ: Optional[SapDouble] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    LIGZE: Optional[SapNvarchar] = ""
    # SAP HANA type: DOUBLE | Forced nullable
    TRANZ: Optional[SapDouble] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    TRAZE: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    ISERH: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    OFM01: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    OFM02: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    OFM03: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    OFM04: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    OFM05: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    OFM06: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    OFMNW: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    BZOFFB: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    EHOFFB: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    OFFSTB: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    OFFSTE: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    BZOFFE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    EHOFFE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FPAVD: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    FPAVZ: Optional[SapNvarchar] = 000000
    # SAP HANA type: NVARCHAR | Forced nullable
    FPEDD: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    FPEDZ: Optional[SapNvarchar] = 000000
    # SAP HANA type: NVARCHAR | Forced nullable
    SPAVD: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    SPAVZ: Optional[SapNvarchar] = 000000
    # SAP HANA type: NVARCHAR | Forced nullable
    SPEDD: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    SPEDZ: Optional[SapNvarchar] = 000000
    # SAP HANA type: NVARCHAR | Forced nullable
    BEAZP: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    PUFGP: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    PUFFP: Optional[SapDecimal] = 0
    # SAP HANA type: DOUBLE | Forced nullable
    BEARP: Optional[SapDouble] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    EPANF: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    EPANZ: Optional[SapNvarchar] = 000000
    # SAP HANA type: NVARCHAR | Forced nullable
    EPEND: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    EPENZ: Optional[SapNvarchar] = 000000
    # SAP HANA type: DECIMAL | Forced nullable
    PDAU: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    PDAE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KNOTE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    VSTZW: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    VSTGA: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    QRASTZEHT: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    QRASTZFAK: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    QRASTMENG: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    QRASTEREH: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    AUFKT: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    RMNGA: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    ILE01: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ILE02: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ILE03: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ILE04: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ILE05: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ILE06: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    RWFAK: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    IPRZ1: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    IPRE1: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    IPRK1: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    TAKT: Optional[SapNvarchar] = 0000
    # SAP HANA type: DECIMAL | Forced nullable
    OPRZ1: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    OPRE1: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PSPM_INDICATOR: Optional[SapNvarchar] = ""

class Bp030(SapHanaBaseModel):
    """
    Model for SAP HANA table: BP030
    Schema: SAPHANADB
    """

    # SAP HANA type: NVARCHAR | Primary key | Order by field
    MANDT: Key[SapNvarchar]
    # SAP HANA type: NVARCHAR | Primary key | Order by field
    PARTNR: Key[SapNvarchar]
    # SAP HANA type: NVARCHAR | Primary key
    ADR_REF_K: Key[SapNvarchar]
    # SAP HANA type: NVARCHAR | Primary key
    ADR_DAT: Key[SapNvarchar]
    # SAP HANA type: NVARCHAR | Forced nullable
    ADRNR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ADDRNUMBER: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ADDRESS_ID: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ADR_D_E: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    ADR_LOC: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FLOOR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ROOM_NR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    NAME3: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    NAME4: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    NAME_CO: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PFACH: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PSTL2: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    TELF1: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    TELF2: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    TELFX1: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    TELFX2: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    TELBX: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    TELX1: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    DATLT: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    TELTX: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ADSMTP: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    TELNR_CALL1: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    TELNR_CALL2: Optional[SapNvarchar] = ""

class But000(SapHanaBaseModel):
    """
    Model for SAP HANA table: BUT000
    Schema: SAPHANADB
    """

    # SAP HANA type: NVARCHAR | Primary key | Order by field
    CLIENT: Key[SapNvarchar]
    # SAP HANA type: NVARCHAR | Primary key | Order by field
    PARTNER: Key[SapNvarchar]
    # SAP HANA type: NVARCHAR | Forced nullable
    TYPE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    BPKIND: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    BU_GROUP: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    BPEXT: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    BU_SORT1: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    BU_SORT2: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SOURCE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    TITLE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    XDELE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    XBLCK: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    AUGRP: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    TITLE_LET: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    BU_LOGSYS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    CONTACT: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    NOT_RELEASED: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    NOT_LG_COMPETENT: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PRINT_MODE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    BP_EEW_DUMMY: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    RATE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    NAME_ORG1: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    NAME_ORG2: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    NAME_ORG3: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    NAME_ORG4: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    LEGAL_ENTY: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    IND_SECTOR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    LEGAL_ORG: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    DC_NOT_REQ: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FOUND_DAT: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    LIQUID_DAT: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    LOCATION_1: Optional[SapNvarchar] = 0000000
    # SAP HANA type: NVARCHAR | Forced nullable
    LOCATION_2: Optional[SapNvarchar] = 00000
    # SAP HANA type: NVARCHAR | Forced nullable
    LOCATION_3: Optional[SapNvarchar] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    NAME_LAST: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    NAME_FIRST: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    NAME_LST2: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    NAME_LAST2: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    NAMEMIDDLE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    TITLE_ACA1: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    TITLE_ACA2: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    TITLE_ROYL: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PREFIX1: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PREFIX2: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    NAME1_TEXT: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    NICKNAME: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    INITIALS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    NAMEFORMAT: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    NAMCOUNTRY: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    LANGU_CORR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    XSEXM: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    XSEXF: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    BIRTHPL: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    MARST: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    EMPLO: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    JOBGR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    NATIO: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    CNTAX: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    CNDSC: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PERSNUMBER: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    XSEXU: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    XUBNAME: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    BU_LANGU: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    GENDER: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    BIRTHDT: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    DEATHDT: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    PERNO: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    CHILDREN: Optional[SapNvarchar] = 00
    # SAP HANA type: DECIMAL | Forced nullable
    MEM_HOUSE: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    BIRTHDT_STATUS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PARTGRPTYP: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    NAME_GRP1: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    NAME_GRP2: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    MC_NAME1: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    MC_NAME2: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    CRUSR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    CRDAT: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    CRTIM: Optional[SapNvarchar] = 000000
    # SAP HANA type: NVARCHAR | Forced nullable
    CHUSR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    CHDAT: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    CHTIM: Optional[SapNvarchar] = 000000
    # SAP HANA type: VARBINARY | Nullable
    PARTNER_GUID: Optional[SapVarbinary] = 00000000000000000000000000000000
    # SAP HANA type: NVARCHAR | Forced nullable
    ADDRCOMM: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    TD_SWITCH: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    IS_ORG_CENTRE: Optional[SapNvarchar] = ""
    # SAP HANA type: VARBINARY | Nullable
    DB_KEY: Optional[SapVarbinary] = 00000000000000000000000000000000
    # SAP HANA type: DECIMAL | Forced nullable
    VALID_FROM: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    VALID_TO: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    XPCPT: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    DATA_CTRLR1: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    DATA_CTRLR2: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    DATA_CTRLR3: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    DATA_CTRLR4: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    DATA_CTRLR5: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    DATA_CTRLR6: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    DATA_CTRLR7: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    DATA_CTRLR8: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    DATA_CTRLR9: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    DATA_CTRLR10: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    XDCSET: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    CEEIB_SK_RESID: Optional[SapNvarchar] = Field(alias="/CEEIB/SK_RESID", default="")
    # SAP HANA type: NVARCHAR | Forced nullable
    BANK_AREA: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    CREDIT_TAX_CODE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    DEBIT_TAX_CODE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    CREDIT_TAX_TYPE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    DEBIT_TAX_TYPE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    NATPERS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    MILVE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    NUC_SEC: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PAR_REL: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    BP_SORT: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KBANKS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KBANKL: Optional[SapNvarchar] = ""

class But020(SapHanaBaseModel):
    """
    Model for SAP HANA table: BUT020
    Schema: SAPHANADB
    """

    # SAP HANA type: NVARCHAR | Primary key | Order by field
    CLIENT: Key[SapNvarchar]
    # SAP HANA type: NVARCHAR | Primary key | Order by field
    PARTNER: Key[SapNvarchar]
    # SAP HANA type: NVARCHAR | Primary key
    ADDRNUMBER: Key[SapNvarchar]
    # SAP HANA type: NVARCHAR | Forced nullable
    XDFADR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ADEXT: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    NATION: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    GUID: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    MOVE_ADDR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    DATE_FROM: Optional[SapNvarchar] = 00000000
    # SAP HANA type: VARBINARY | Nullable
    ADDRESS_GUID: Optional[SapVarbinary] = 00000000000000000000000000000000
    # SAP HANA type: DECIMAL | Forced nullable
    ADDR_VALID_FROM: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    ADDR_VALID_TO: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    ADDR_MOVE_DATE: Optional[SapDecimal] = 0

class But050(SapHanaBaseModel):
    """
    Model for SAP HANA table: BUT050
    Schema: SAPHANADB
    """

    # SAP HANA type: NVARCHAR | Primary key | Order by field
    CLIENT: Key[SapNvarchar]
    # SAP HANA type: NVARCHAR | Primary key | Order by field
    RELNR: Key[SapNvarchar]
    # SAP HANA type: NVARCHAR | Primary key
    PARTNER1: Key[SapNvarchar]
    # SAP HANA type: NVARCHAR | Primary key
    PARTNER2: Key[SapNvarchar]
    # SAP HANA type: NVARCHAR | Primary key
    DATE_TO: Key[SapNvarchar]
    # SAP HANA type: NVARCHAR | Forced nullable
    DATE_FROM: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    RELTYP: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    XRF: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    DFTVAL: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    RLTYP: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    RELKIND: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    CRUSR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    CRDAT: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    CRTIM: Optional[SapNvarchar] = 000000
    # SAP HANA type: NVARCHAR | Forced nullable
    CHUSR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    CHDAT: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    CHTIM: Optional[SapNvarchar] = 000000
    # SAP HANA type: NVARCHAR | Forced nullable
    XDFREL: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    XDFREL2: Optional[SapNvarchar] = ""
    # SAP HANA type: VARBINARY | Nullable
    DB_KEY: Optional[SapVarbinary] = 00000000000000000000000000000000
    # SAP HANA type: VARBINARY | Nullable
    DB_KEY_TD: Optional[SapVarbinary] = 00000000000000000000000000000000

class But100(SapHanaBaseModel):
    """
    Model for SAP HANA table: BUT100
    Schema: SAPHANADB
    """

    # SAP HANA type: NVARCHAR | Primary key | Order by field
    MANDT: Key[SapNvarchar]
    # SAP HANA type: NVARCHAR | Primary key | Order by field
    PARTNER: Key[SapNvarchar]
    # SAP HANA type: NVARCHAR | Primary key
    RLTYP: Key[SapNvarchar]
    # SAP HANA type: NVARCHAR | Primary key
    DFVAL: Key[SapNvarchar]
    # SAP HANA type: DECIMAL | Forced nullable
    VALID_FROM: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    VALID_TO: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    ROLE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    AUTHORITY: Optional[SapNvarchar] = ""

class Cabn(SapHanaBaseModel):
    """
    Model for SAP HANA table: CABN
    Schema: SAPHANADB
    """

    # SAP HANA type: NVARCHAR | Primary key | Order by field
    MANDT: Key[SapNvarchar]
    # SAP HANA type: NVARCHAR | Primary key
    ATINN: Key[SapNvarchar]
    # SAP HANA type: NVARCHAR | Primary key
    ADZHL: Key[SapNvarchar]
    # SAP HANA type: NVARCHAR | Forced nullable
    ATNAM: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ATIDN: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ATFOR: Optional[SapNvarchar] = ""
    # SAP HANA type: SMALLINT | Forced nullable
    ANZST: Optional[SapSmallInt] = 0
    # SAP HANA type: SMALLINT | Forced nullable
    ANZDZ: Optional[SapSmallInt] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    ATVOR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ATSCH: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ATKLE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ATKON: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ATEND: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ATAEN: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ATKLA: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ATERF: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ATEIN: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ATAME: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ATWME: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    MSEHI: Optional[SapNvarchar] = ""
    # SAP HANA type: SMALLINT | Forced nullable
    ATDIM: Optional[SapSmallInt] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    ATGLO: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ATGLA: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ATINT: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ATUNS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ATSON: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ATTAB: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ATFEL: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ATTEI: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ATPRT: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ATPRR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ATPRF: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ATWRD: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ATFOD: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ATHIE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ATDEX: Optional[SapNvarchar] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    ATFGA: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ATVSC: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ANAME: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ADATU: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    VNAME: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    VDATU: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    ATXAC: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ATYAC: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ATMST: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ATWSO: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ATBSO: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    DATUV: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    TECHV: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    AENNR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    LKENZ: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ATWRI: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    DOKAR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    DOKNR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    DOKVR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    DOKTL: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KNOBJ: Optional[SapNvarchar] = 000000000000000000
    # SAP HANA type: NVARCHAR | Forced nullable
    ATINP: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ATVIE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    WERKS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KATALOGART: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    AUSWAHLMGE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ATHKA: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ATHKO: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    CLINT: Optional[SapNvarchar] = 0000000000
    # SAP HANA type: NVARCHAR | Forced nullable
    ATTOL: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ATZUS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ATVPL: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ATAUTH: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    COUNTRYGRP: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    DATUB: Optional[SapNvarchar] = 00000000
    # SAP HANA type: DECIMAL | Order by field
    LASTCHANGEDDATETIME: SapDecimal
    # SAP HANA type: NVARCHAR | Forced nullable
    UNIT: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    CURRENCY: Optional[SapNvarchar] = ""

class Cawn(SapHanaBaseModel):
    """
    Model for SAP HANA table: CAWN
    Schema: SAPHANADB
    """

    # SAP HANA type: NVARCHAR | Primary key | Order by field
    MANDT: Key[SapNvarchar]
    # SAP HANA type: NVARCHAR | Primary key
    ATINN: Key[SapNvarchar]
    # SAP HANA type: NVARCHAR | Primary key
    ATZHL: Key[SapNvarchar]
    # SAP HANA type: NVARCHAR | Primary key
    ADZHL: Key[SapNvarchar]
    # SAP HANA type: NVARCHAR | Forced nullable
    ATWRT: Optional[SapNvarchar] = ""
    # SAP HANA type: DOUBLE | Forced nullable
    ATFLV: Optional[SapDouble] = 0
    # SAP HANA type: DOUBLE | Forced nullable
    ATFLB: Optional[SapDouble] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    ATCOD: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ATSTD: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ATAWE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ATAW1: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ATIDN: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SPRAS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    TXTNR: Optional[SapNvarchar] = 0000
    # SAP HANA type: NVARCHAR | Forced nullable
    DATUV: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    TECHV: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    AENNR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    LKENZ: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    DOKAR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    DOKNR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    DOKVR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    DOKTL: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ATZHH: Optional[SapNvarchar] = 0000
    # SAP HANA type: NVARCHAR | Forced nullable
    KNOBJ: Optional[SapNvarchar] = 000000000000000000
    # SAP HANA type: NVARCHAR | Forced nullable
    ATWHI: Optional[SapNvarchar] = ""
    # SAP HANA type: DOUBLE | Forced nullable
    ATTLV: Optional[SapDouble] = 0
    # SAP HANA type: DOUBLE | Forced nullable
    ATTLB: Optional[SapDouble] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    ATPRZ: Optional[SapNvarchar] = ""
    # SAP HANA type: DOUBLE | Forced nullable
    ATINC: Optional[SapDouble] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    ATVPL: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    DATUB: Optional[SapNvarchar] = 00000000
    # SAP HANA type: DECIMAL | Forced nullable
    DEC_FROM: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    DEC_TO: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    DATE_FROM: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    DATE_TO: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Order by field
    TIME_FROM: SapNvarchar
    # SAP HANA type: NVARCHAR | Order by field
    TIME_TO: SapNvarchar
    # SAP HANA type: DECIMAL | Forced nullable
    CURR_FROM: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    CURR_TO: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    CURRENCY: Optional[SapNvarchar] = ""

class Crca(SapHanaBaseModel):
    """
    Model for SAP HANA table: CRCA
    Schema: SAPHANADB
    """

    # SAP HANA type: NVARCHAR | Primary key | Order by field
    MANDT: Key[SapNvarchar]
    # SAP HANA type: NVARCHAR | Primary key | Order by field
    OBJTY: Key[SapNvarchar]
    # SAP HANA type: NVARCHAR | Primary key
    OBJID: Key[SapNvarchar]
    # SAP HANA type: NVARCHAR | Primary key
    CANUM: Key[SapNvarchar]
    # SAP HANA type: NVARCHAR | Forced nullable
    BEGDA: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    ENDDA: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    AEDAT_KAPA: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    AENAM_KAPA: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KAPID: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    FORK1: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FORK2: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FORK3: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FORKN: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PROZT: Optional[SapNvarchar] = 000
    # SAP HANA type: NVARCHAR | Forced nullable
    VERT1: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    VERT2: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    VERT3: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    VERTN: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    CAROL: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ISTBED_KZ: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    VGWT1: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    VGWT2: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    VGWT3: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    VGWTN: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    CAP_BACKFLUSH_SU: Optional[SapNvarchar] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    CAP_BACKFLUSH_PR: Optional[SapNvarchar] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    CAP_BACKFLUSH_TD: Optional[SapNvarchar] = 0

class Crfh(SapHanaBaseModel):
    """
    Model for SAP HANA table: CRFH
    Schema: SAPHANADB
    """

    # SAP HANA type: NVARCHAR | Primary key | Order by field
    MANDT: Key[SapNvarchar]
    # SAP HANA type: NVARCHAR | Primary key | Order by field
    OBJTY: Key[SapNvarchar]
    # SAP HANA type: NVARCHAR | Primary key
    OBJID: Key[SapNvarchar]
    # SAP HANA type: NVARCHAR | Primary key
    ZAEHL: Key[SapNvarchar]
    # SAP HANA type: NVARCHAR | Forced nullable
    FHMAR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    OBJTY_V: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    OBJID_V: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    LOEKZ: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    DATUV: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    DATUB: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    AENNR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ANNAM: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ANDAT: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    AENAM: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    AEDAT: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    BRGRU: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    STATUS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KZKBL: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    STOWK: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    STORT: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    BASEH: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    STEUF: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    STEUF_REF: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FGRU1: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FGRU2: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PLANV: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KTSCH: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KTSCH_REF: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    BZOFFB: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    BZOFFB_REF: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    OFFSTB: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    EHOFFB: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    OFFSTB_REF: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    BZOFFE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    BZOFFE_REF: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    OFFSTE: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    EHOFFE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    OFFSTE_REF: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    MGFORM: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    MGFORM_REF: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    EWFORM: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    EWFORM_REF: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PAR01: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PAR02: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PAR03: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PAR04: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PAR05: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PAR06: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PARU1: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PARU2: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PARU3: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PARU4: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PARU5: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PARU6: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    PARV1: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    PARV2: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    PARV3: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    PARV4: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    PARV5: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    PARV6: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    REGISTRABLE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    TOOL_WC_OBJTY: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    TOOL_WC_OBJID: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    TOOL_WC_WERKS: Optional[SapNvarchar] = ""

class Crhd(SapHanaBaseModel):
    """
    Model for SAP HANA table: CRHD
    Schema: SAPHANADB
    """

    # SAP HANA type: NVARCHAR | Primary key | Order by field
    MANDT: Key[SapNvarchar]
    # SAP HANA type: NVARCHAR | Primary key
    OBJTY: Key[SapNvarchar]
    # SAP HANA type: NVARCHAR | Primary key
    OBJID: Key[SapNvarchar]
    # SAP HANA type: NVARCHAR | Forced nullable
    BEGDA: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    ENDDA: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    AEDAT_GRND: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    AENAM_GRND: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    AEDAT_VORA: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    AENAM_VORA: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    AEDAT_TERM: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    AENAM_TERM: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    AEDAT_TECH: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    AENAM_TECH: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ARBPL: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    WERKS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    VERWE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    LVORM: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PAR01: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PAR02: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PAR03: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PAR04: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PAR05: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PAR06: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PARU1: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PARU2: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PARU3: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PARU4: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PARU5: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PARU6: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    PARV1: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    PARV2: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    PARV3: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    PARV4: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    PARV5: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    PARV6: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    PLANV: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    STAND: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    VERAN: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    VGWTS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    VGM01: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    VGM02: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    VGM03: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    VGM04: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    VGM05: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    VGM06: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    XDEFA: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    XKOST: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    XSPRR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    XTERM: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ZGR01: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ZGR02: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ZGR03: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ZGR04: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ZGR05: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ZGR06: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KTSCH: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    LOANZ: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    LOART: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    LOGRP: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    QUALF: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    RASCH: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    STEUS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    VGE01: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    VGE02: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    VGE03: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    VGE04: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    VGE05: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    VGE06: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KTSCH_REF: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    LOART_REF: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    LOANZ_REF: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    LOGRP_REF: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    QUALF_REF: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    RASCH_REF: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    STEUS_REF: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FORT1: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FORT2: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FORT3: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KAPID: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    ORTGR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ZEIWN: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    ZWNOR: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    ZEIWM: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    ZWMIN: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    FORMR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    MATYP: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    CPLGR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SORTB: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    MTRVP: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    MTMVP: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    MTPVP: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    RSANZ: Optional[SapNvarchar] = 000
    # SAP HANA type: NVARCHAR | Forced nullable
    PDEST: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    HROID: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    FORTN: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ZGR01_REF: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ZGR02_REF: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ZGR03_REF: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ZGR04_REF: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ZGR05_REF: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ZGR06_REF: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    STEUS_C: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    STEUS_I: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    STEUS_N: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    STEUS_Q: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    RUZUS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    RSANZ_REF: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    HR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PRVBE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SUBSYS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    BDEGR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    RGEKZ: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    HRTYP: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SLWID: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    LIFNR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SLWID_REF: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    LIFNR_REF: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    VGARB: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    VGDIM: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    HRPLVAR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    VGDAU: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    STOBJ: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    RESGR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    LGORT_RES: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    MIXMAT: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ISTBED_KZ: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Order by field
    LASTCHANGE_DATETIME: SapDecimal
    # SAP HANA type: NVARCHAR | Forced nullable
    EBELN_EXT: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    EBELP_EXT: Optional[SapNvarchar] = 00000
    # SAP HANA type: NVARCHAR | Forced nullable
    LIFNR_EXT: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    EKGRP_EXT: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    EKORG_EXT: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    MGHNO_EXT: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    MATKL_EXT: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PPSKZ: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SRTYPE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SNTYPE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    S_LABOR_TRACK: Optional[SapNvarchar] = ""

class Crtx(SapHanaBaseModel):
    """
    Model for SAP HANA table: CRTX
    Schema: SAPHANADB
    """

    # SAP HANA type: NVARCHAR | Primary key | Order by field
    MANDT: Key[SapNvarchar]
    # SAP HANA type: NVARCHAR | Primary key | Order by field
    OBJTY: Key[SapNvarchar]
    # SAP HANA type: NVARCHAR | Primary key
    OBJID: Key[SapNvarchar]
    # SAP HANA type: NVARCHAR | Primary key
    SPRAS: Key[SapNvarchar]
    # SAP HANA type: NVARCHAR | Forced nullable
    AEDAT_TEXT: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    AENAM_TEXT: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KTEXT: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KTEXT_UP: Optional[SapNvarchar] = ""

class Dd01t(SapHanaBaseModel):
    """
    Model for SAP HANA table: DD01T
    Schema: SAPHANADB
    """

    # SAP HANA type: NVARCHAR | Primary key | Order by field
    DOMNAME: Key[SapNvarchar]
    # SAP HANA type: NVARCHAR | Primary key | Order by field
    DDLANGUAGE: Key[SapNvarchar]
    # SAP HANA type: NVARCHAR | Primary key
    AS4LOCAL: Key[SapNvarchar]
    # SAP HANA type: NVARCHAR | Primary key
    AS4VERS: Key[SapNvarchar]
    # SAP HANA type: NVARCHAR | Forced nullable
    DDTEXT: Optional[SapNvarchar] = ""

class Dd02l(SapHanaBaseModel):
    """
    Model for SAP HANA table: DD02L
    Schema: SAPHANADB
    """

    # SAP HANA type: NVARCHAR | Primary key | Order by field
    TABNAME: Key[SapNvarchar]
    # SAP HANA type: NVARCHAR | Primary key
    AS4LOCAL: Key[SapNvarchar]
    # SAP HANA type: NVARCHAR | Primary key
    AS4VERS: Key[SapNvarchar]
    # SAP HANA type: NVARCHAR | Forced nullable
    TABCLASS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SQLTAB: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    DATMIN: Optional[SapNvarchar] = 0000000000
    # SAP HANA type: NVARCHAR | Forced nullable
    DATMAX: Optional[SapNvarchar] = 0000000000
    # SAP HANA type: NVARCHAR | Forced nullable
    DATAVG: Optional[SapNvarchar] = 0000000000
    # SAP HANA type: NVARCHAR | Forced nullable
    CLIDEP: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    BUFFERED: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    COMPRFLAG: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    LANGDEP: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ACTFLAG: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    APPLCLASS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    AUTHCLASS: Optional[SapNvarchar] = 00
    # SAP HANA type: NVARCHAR | Forced nullable
    AS4USER: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    AS4DATE: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Order by field
    AS4TIME: SapNvarchar
    # SAP HANA type: NVARCHAR | Forced nullable
    MASTERLANG: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    MAINFLAG: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    CONTFLAG: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    RESERVETAB: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    GLOBALFLAG: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PROZPUFF: Optional[SapNvarchar] = 000
    # SAP HANA type: NVARCHAR | Forced nullable
    VIEWCLASS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    VIEWGRANT: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    MULTIPLEX: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SHLPEXI: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PROXYTYPE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    EXCLASS: Optional[SapNvarchar] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    WRONGCL: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ALWAYSTRP: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ALLDATAINCL: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    WITH_PARAMETERS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    EXVIEW_INCLUDED: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KEYMAX_FEATURE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KEYLEN_FEATURE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    TABLEN_FEATURE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    NONTRP_INCLUDED: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    VIEWREF: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    VIEWREF_ERR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    VIEWREF_POS_CHG: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    TBFUNC_INCLUDED: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    IS_GTT: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SESSION_VAR_EX: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FROM_ENTITY: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PK_IS_INVHASH: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    USED_SESSION_VARS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ABAP_LANGUAGE_VERSION: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    HDB_ONLY_ENTITY_INCLUDED: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FIELD_SUFFIX: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    QUOTA_MAX_FIELDS: Optional[SapNvarchar] = 00000
    # SAP HANA type: NVARCHAR | Forced nullable
    QUOTA_MAX_BYTES: Optional[SapNvarchar] = 0000000
    # SAP HANA type: NVARCHAR | Forced nullable
    QUOTA_SHARE_PARTNER: Optional[SapNvarchar] = 000
    # SAP HANA type: NVARCHAR | Forced nullable
    QUOTA_SHARE_CUSTOMER: Optional[SapNvarchar] = 000

class Dd02t(SapHanaBaseModel):
    """
    Model for SAP HANA table: DD02T
    Schema: SAPHANADB
    """

    # SAP HANA type: NVARCHAR | Primary key | Order by field
    TABNAME: Key[SapNvarchar]
    # SAP HANA type: NVARCHAR | Primary key | Order by field
    DDLANGUAGE: Key[SapNvarchar]
    # SAP HANA type: NVARCHAR | Primary key
    AS4LOCAL: Key[SapNvarchar]
    # SAP HANA type: NVARCHAR | Primary key
    AS4VERS: Key[SapNvarchar]
    # SAP HANA type: NVARCHAR | Forced nullable
    DDTEXT: Optional[SapNvarchar] = ""

class Eban(SapHanaBaseModel):
    """
    Model for SAP HANA table: EBAN
    Schema: SAPHANADB
    """

    # SAP HANA type: NVARCHAR | Primary key | Order by field
    MANDT: Key[SapNvarchar]
    # SAP HANA type: NVARCHAR | Primary key
    BANFN: Key[SapNvarchar]
    # SAP HANA type: NVARCHAR | Primary key
    BNFPO: Key[SapNvarchar]
    # SAP HANA type: NVARCHAR | Forced nullable
    BSART: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    BSTYP: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    BSAKZ: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    LOEKZ: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    STATU: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ESTKZ: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FRGKZ: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FRGZU: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FRGST: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    EKGRP: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ERNAM: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ERDAT: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    AFNAM: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    TXZ01: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    MATNR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    EMATN: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    WERKS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    LGORT: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    BEDNR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    MATKL: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    RESWK: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    MENGE: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    MEINS: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    BUMNG: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    BADAT: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    LPEIN: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    LFDAT: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    FRGDT: Optional[SapNvarchar] = 00000000
    # SAP HANA type: DECIMAL | Forced nullable
    WEBAZ: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    PREIS: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    PEINH: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    PSTYP: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KNTTP: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KZVBR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KFLAG: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    VRTKZ: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    TWRKZ: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    WEPOS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    WEUNB: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    REPOS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    LIFNR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FLIEF: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    EKORG: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    VRTYP: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KONNR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KTPNR: Optional[SapNvarchar] = 00000
    # SAP HANA type: NVARCHAR | Forced nullable
    INFNR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ZUGBA: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    QUNUM: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    QUPOS: Optional[SapNvarchar] = 000
    # SAP HANA type: NVARCHAR | Forced nullable
    DISPO: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SERNR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    BVDAT: Optional[SapNvarchar] = 00000000
    # SAP HANA type: DECIMAL | Forced nullable
    BATOL: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    BVDRK: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    EBELN: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    EBELP: Optional[SapNvarchar] = 00000
    # SAP HANA type: NVARCHAR | Forced nullable
    BEDAT: Optional[SapNvarchar] = 00000000
    # SAP HANA type: DECIMAL | Forced nullable
    BSMNG: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    LIMIT_CONSUMPTION_VALUE: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    LBLNI: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    BWTAR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    XOBLR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    EBAKZ: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    RSNUM: Optional[SapNvarchar] = 0000000000
    # SAP HANA type: NVARCHAR | Forced nullable
    SOBKZ: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ARSNR: Optional[SapNvarchar] = 0000000000
    # SAP HANA type: NVARCHAR | Forced nullable
    ARSPS: Optional[SapNvarchar] = 0000
    # SAP HANA type: NVARCHAR | Forced nullable
    FIXKZ: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    BMEIN: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    REVLV: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    VORAB: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PACKNO: Optional[SapNvarchar] = 0000000000
    # SAP HANA type: NVARCHAR | Forced nullable
    KANBA: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    BPUEB: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    CUOBJ: Optional[SapNvarchar] = 000000000000000000
    # SAP HANA type: NVARCHAR | Forced nullable
    FRGGR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FRGRL: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    AKTNR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    CHARG: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    UMSOK: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    VERID: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FIPOS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FISTL: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    GEBER: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KZKFG: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SATNR: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    MNG02: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    DAT01: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    ATTYP: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ADRNR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ADRN2: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KUNNR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    EMLIF: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    LBLKZ: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KZBWS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    WAERS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    IDNLF: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    GSFRG: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    MPROF: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KZFME: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SPRAS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    TECHS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    MFRPN: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    MFRNR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    EMNFR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FORDN: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FORDP: Optional[SapNvarchar] = 00000
    # SAP HANA type: DECIMAL | Forced nullable
    PLIFZ: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    BERID: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    UZEIT: Optional[SapNvarchar] = 000000
    # SAP HANA type: NVARCHAR | Forced nullable
    FKBER: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    GRANT_NBR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    MEMORY: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    BANPR: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    RLWRT: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    BLCKD: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    REVNO: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    BLCKT: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    BESWK: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    EPROFILE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    EPREFDOC: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    EPREFITM: Optional[SapNvarchar] = 00000
    # SAP HANA type: DECIMAL | Forced nullable
    GMMNG: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    WRTKZ: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    RESLO: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KBLNR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KBLPOS: Optional[SapNvarchar] = 000
    # SAP HANA type: NVARCHAR | Forced nullable
    PRIO_URG: Optional[SapNvarchar] = 00
    # SAP HANA type: NVARCHAR | Forced nullable
    PRIO_REQ: Optional[SapNvarchar] = 000
    # SAP HANA type: NVARCHAR | Forced nullable
    MEMORYTYPE: Optional[SapNvarchar] = ""
    # SAP HANA type: INTEGER | Forced nullable
    ANZSN: Optional[SapInteger] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    MHDRZ: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    IPRKZ: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    NODISP: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SRM_CONTRACT_ID: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SRM_CONTRACT_ITM: Optional[SapNvarchar] = 0000000000
    # SAP HANA type: NVARCHAR | Forced nullable
    BUDGET_PD: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ELDAT: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    EXPERT_MODE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    CENTRAL_PURREQN_PROC: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SPE_CRM_REF_SO: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SPE_CRM_REF_ITEM: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    INDELEGATEAPPROVAL: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    DUMMY_EBAN_INCL_EEW_PS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    STORENETWORKID: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    STORESUPPLIERID: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    CREATIONDATE: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Order by field
    CREATIONTIME: SapNvarchar
    # SAP HANA type: NVARCHAR | Forced nullable
    PRODUCTTYPE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SERVICEPERFORMER: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ISEOPBLOCKED: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    EXT_REV_TMSTMP: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    FMFGUS_KEY: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    STARTDATE: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    ENDDATE: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    EXTMATERIALFORPURG: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    EXTFIXEDSUPPLIERFORPURG: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    EXTDESIREDSUPPLIERFORPURG: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    EXTCONTRACTFORPURG: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    EXTCONTRACTITEMFORPURG: Optional[SapNvarchar] = 00000
    # SAP HANA type: NVARCHAR | Forced nullable
    EXTINFORECORDFORPURG: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    EXTPLANTFORPURG: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    EXTSTORAGELOCATIONFORPURG: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    EXTCOMPANYCODEFORPURG: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    EXTPURGORGFORPURG: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    EXTSOURCESYSTEM: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    EXT_BE_SOURCE_SYS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    EXT_BE_PRCHANGEINDICATOR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    EXTDOCTYPEFORPURG: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ISCRREPLICATIONBEFOREAPPROVAL: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    MMPUR_PR_CEN_REQN_APP_RPLD_PR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    EXTAPPROVALSTATUS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    STAGINGFLDEXTAPPROVALSTATUS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PURCHASEREQNITEMUNIQUEID: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Order by field
    LASTCHANGEDATETIME: SapDecimal
    # SAP HANA type: NVARCHAR | Forced nullable
    ISONBEHALFCART: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SDM_VERSION: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SAKTO: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KOSTL: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    EXPECTED_VALUE: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    LIMIT_AMOUNT: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    CONTRACT_FOR_LIMIT: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    DELIVERYADDRTYPE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    MWSKZ: Optional[SapNvarchar] = ""
    # SAP HANA type: VARBINARY | Nullable
    PFMTRANSDATAFOOTPRINTUUID: Optional[SapVarbinary] = 00000000000000000000000000000000
    # SAP HANA type: NVARCHAR | Forced nullable
    HASTRADECOMPLIANCEISSUE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PURREQNDESCRIPTION: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ISOUTLINE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PARENT_ITEM_NO: Optional[SapNvarchar] = 00000
    # SAP HANA type: NVARCHAR | Forced nullable
    OUTLINE_TYPE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    EXLIN: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    EXSNR: Optional[SapNvarchar] = 00000
    # SAP HANA type: NVARCHAR | Forced nullable
    ADVCODE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    STACODE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    BANFN_CS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    BNFPO_CS: Optional[SapNvarchar] = 00000
    # SAP HANA type: NVARCHAR | Forced nullable
    ITEM_CS: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    BSMNG_SND: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    NO_MARD_DATA: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ADMOI: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ADPRI: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    LPRIO: Optional[SapNvarchar] = 00
    # SAP HANA type: NVARCHAR | Forced nullable
    ADACN: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ADDNS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SERRU: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    DISUB_SOBKZ: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    DISUB_PSPNR: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    DISUB_KUNNR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    DISUB_VBELN: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    DISUB_POSNR: Optional[SapNvarchar] = 000000
    # SAP HANA type: NVARCHAR | Forced nullable
    DISUB_OWNER: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FLDLOGSSUPPLYPROCESS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FLDLOGSDELIVISHELDONSHORE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FLDLOGSVERSION: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FSH_SEASON_YEAR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FSH_SEASON: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FSH_COLLECTION: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FSH_THEME: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FSH_VAS_REL: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FSH_VAS_PRNT_ID: Optional[SapNvarchar] = 00000
    # SAP HANA type: NVARCHAR | Forced nullable
    FSH_TRANSACTION: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FSH_ITEM_GROUP: Optional[SapNvarchar] = 00000
    # SAP HANA type: NVARCHAR | Forced nullable
    FSH_ITEM: Optional[SapNvarchar] = 00000
    # SAP HANA type: NVARCHAR | Forced nullable
    IUID_RELEVANT: Optional[SapNvarchar] = ""
    # SAP HANA type: INTEGER | Forced nullable
    SC_SR_ITEM_KEY: Optional[SapInteger] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    SC_CATALOGID: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SC_CATALOGITEM: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SC_REQUESTOR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SC_AUTHOR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SGT_SCAT: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SGT_RCAT: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    WRF_CHARSTC1: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    WRF_CHARSTC2: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    WRF_CHARSTC3: Optional[SapNvarchar] = ""

class Ekkn(SapHanaBaseModel):
    """
    Model for SAP HANA table: EKKN
    Schema: SAPHANADB
    """

    # SAP HANA type: NVARCHAR | Primary key | Order by field
    MANDT: Key[SapNvarchar]
    # SAP HANA type: NVARCHAR | Primary key | Order by field
    EBELN: Key[SapNvarchar]
    # SAP HANA type: NVARCHAR | Primary key
    EBELP: Key[SapNvarchar]
    # SAP HANA type: NVARCHAR | Primary key
    ZEKKN: Key[SapNvarchar]
    # SAP HANA type: NVARCHAR | Forced nullable
    LOEKZ: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    AEDAT: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    KFLAG: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    MENGE: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    VPROZ: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    NETWR: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    SAKTO: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    GSBER: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KOSTL: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PROJN: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    VBELN: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    VBELP: Optional[SapNvarchar] = 000000
    # SAP HANA type: NVARCHAR | Forced nullable
    VETEN: Optional[SapNvarchar] = 0000
    # SAP HANA type: NVARCHAR | Forced nullable
    KZBRB: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ANLN1: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ANLN2: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    AUFNR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    WEMPF: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ABLAD: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KOKRS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    XBKST: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    XBAUF: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    XBPRO: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    EREKZ: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KSTRG: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PAOBJNR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PRCTR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PS_PSP_PNR: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    NPLNR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    AUFPL: Optional[SapNvarchar] = 0000000000
    # SAP HANA type: NVARCHAR | Forced nullable
    IMKEY: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    APLZL: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    VPTNR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FIPOS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    RECID: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SERVICE_DOC_TYPE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SERVICE_DOC_ID: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SERVICE_DOC_ITEM_ID: Optional[SapNvarchar] = 000000
    # SAP HANA type: NVARCHAR | Forced nullable
    DUMMY_INCL_EEW_COBL: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FISTL: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    GEBER: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FKBER: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    DABRZ: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    AUFPL_ORD: Optional[SapNvarchar] = 0000000000
    # SAP HANA type: NVARCHAR | Forced nullable
    APLZL_ORD: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    MWSKZ: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    TXJCD: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    NAVNW: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    KBLNR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KBLPOS: Optional[SapNvarchar] = 000
    # SAP HANA type: NVARCHAR | Forced nullable
    LSTAR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PRZNR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    GRANT_NBR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    BUDGET_PD: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FM_SPLIT_BATCH: Optional[SapNvarchar] = 000
    # SAP HANA type: NVARCHAR | Forced nullable
    FM_SPLIT_BEGRU: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    AA_FINAL_IND: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    AA_FINAL_REASON: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    AA_FINAL_QTY: Optional[SapDecimal] = 0
    # SAP HANA type: DOUBLE | Forced nullable
    AA_FINAL_QTY_F: Optional[SapDouble] = 0
    # SAP HANA type: DOUBLE | Forced nullable
    MENGE_F: Optional[SapDouble] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    FMFGUS_KEY: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    DATAAGING: Optional[SapNvarchar] = Field(alias="_DATAAGING", default=00000000)
    # SAP HANA type: NVARCHAR | Forced nullable
    EGRUP: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    VNAME: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KBLNR_CAB: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KBLPOS_CAB: Optional[SapNvarchar] = 000
    # SAP HANA type: NVARCHAR | Forced nullable
    TCOBJNR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    DATEOFSERVICE: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    NOTAXCORR: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    DIFFOPTRATE: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    HASDIFFOPTRATE: Optional[SapNvarchar] = ""

class Ekko(SapHanaBaseModel):
    """
    Model for SAP HANA table: EKKO
    Schema: SAPHANADB
    """

    # SAP HANA type: NVARCHAR | Primary key | Order by field
    MANDT: Key[SapNvarchar]
    # SAP HANA type: NVARCHAR | Primary key
    EBELN: Key[SapNvarchar]
    # SAP HANA type: NVARCHAR | Forced nullable
    BUKRS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    BSTYP: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    BSART: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    BSAKZ: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    LOEKZ: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    STATU: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    AEDAT: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    ERNAM: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Order by field
    LASTCHANGEDATETIME: SapDecimal
    # SAP HANA type: NVARCHAR | Forced nullable
    PINCR: Optional[SapNvarchar] = 00000
    # SAP HANA type: NVARCHAR | Forced nullable
    LPONR: Optional[SapNvarchar] = 00000
    # SAP HANA type: NVARCHAR | Forced nullable
    LIFNR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SPRAS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ZTERM: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    ZBD1T: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    ZBD2T: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    ZBD3T: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    ZBD1P: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    ZBD2P: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    EKORG: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    EKGRP: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    WAERS: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    WKURS: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    KUFIX: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    BEDAT: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    KDATB: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    KDATE: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    BWBDT: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    ANGDT: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    BNDDT: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    GWLDT: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    AUSNR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ANGNR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    IHRAN: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    IHREZ: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    VERKF: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    TELF1: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    LLIEF: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KUNNR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ACTIVE_ID: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KONNR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ABGRU: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    AUTLF: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    WEAKT: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    RESWK: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    LBLIF: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    INCO1: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    INCO2: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    KTWRT: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    DISTRIBUTIONTYPE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SUBMI: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KNUMV: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KALSM: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    STAFO: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    LIFRE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    EXNUM: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    UNSEZ: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    LOGSY: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    UPINC: Optional[SapNvarchar] = 00000
    # SAP HANA type: NVARCHAR | Forced nullable
    STAKO: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FRGGR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FRGSX: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FRGKE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FRGZU: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FRGRL: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    LANDS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    LPHIS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ADRNR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    STCEG_L: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    STCEG: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ABSGR: Optional[SapNvarchar] = 00
    # SAP HANA type: NVARCHAR | Forced nullable
    ADDNR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KORNR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    MEMORY: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PROCSTAT: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PROCESS_INDICATOR: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    RLWRT: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    CR_STAT: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    REVNO: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SCMPROC: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    REASON_CODE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    MEMORYTYPE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    RETTP: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    RETPC: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    DPTYP: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    DPPCT: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    DPAMT: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    DPDAT: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    MSR_ID: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    HIERARCHY_EXISTS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    GROUPING_ID: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PARENT_ID: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    THRESHOLD_EXISTS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    LEGAL_CONTRACT: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    DESCRIPTION: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    RELEASE_DATE: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    VSART: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    HANDOVERLOC: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SHIPCOND: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    INCOV: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    INCO2_L: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    INCO3_L: Optional[SapNvarchar] = ""
    # SAP HANA type: VARBINARY | Nullable
    INCO2_KEY: Optional[SapVarbinary] = 00000000000000000000000000000000
    # SAP HANA type: VARBINARY | Nullable
    INCO3_KEY: Optional[SapVarbinary] = 00000000000000000000000000000000
    # SAP HANA type: VARBINARY | Nullable
    INCO4_KEY: Optional[SapVarbinary] = 00000000000000000000000000000000
    # SAP HANA type: NVARCHAR | Forced nullable
    GRWCU: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    INTRA_REL: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    INTRA_EXCL: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    TOTAL_STATUS_PCS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    TOTAL_STATUS_PMA: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    TOTAL_STATUS_DG: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    TOTAL_STATUS_SDS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    QTN_ERLST_SUBMSN_DATE: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    FOLLOWON_DOC_CAT: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FOLLOWON_DOC_TYPE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    DUMMY_EKKO_INCL_EEW_PS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    EXTERNALSYSTEM: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    EXTERNALREFERENCEID: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    EXT_REV_TMSTMP: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    ISEOPBLOCKED: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ISAGED: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FORCE_ID: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FORCE_CNT: Optional[SapNvarchar] = 000000
    # SAP HANA type: NVARCHAR | Forced nullable
    RELOC_ID: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    RELOC_SEQ_ID: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SOURCE_LOGSYS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FSH_TRANSACTION: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FSH_ITEM_GROUP: Optional[SapNvarchar] = 00000
    # SAP HANA type: NVARCHAR | Forced nullable
    FSH_VAS_LAST_ITEM: Optional[SapNvarchar] = 00000
    # SAP HANA type: NVARCHAR | Forced nullable
    FSH_OS_STG_CHANGE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    TMS_REF_UUID: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    DMBE_PAYMENTDEEMED: Optional[SapNvarchar] = Field(alias="/DMBE/PAYMENTDEEMED", default=00000000)
    # SAP HANA type: NVARCHAR | Forced nullable
    DMBE_DEALNUMBER: Optional[SapNvarchar] = Field(alias="/DMBE/DEALNUMBER", default="")
    # SAP HANA type: NVARCHAR | Forced nullable
    DMBE_EVGIDRENEWAL: Optional[SapNvarchar] = Field(alias="/DMBE/EVGIDRENEWAL", default="")
    # SAP HANA type: NVARCHAR | Forced nullable
    DMBE_EVGIDCANCEL: Optional[SapNvarchar] = Field(alias="/DMBE/EVGIDCANCEL", default="")
    # SAP HANA type: NVARCHAR | Forced nullable
    ZAPCGK: Optional[SapNvarchar] = 0000
    # SAP HANA type: NVARCHAR | Forced nullable
    APCGK_EXTEND: Optional[SapNvarchar] = 0000000000
    # SAP HANA type: NVARCHAR | Forced nullable
    ZBAS_DATE: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    ZADATTYP: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ZSTART_DAT: Optional[SapNvarchar] = 00000000
    # SAP HANA type: DECIMAL | Forced nullable
    Z_DEV: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    ZINDANX: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ZLIMIT_DAT: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    NUMERATOR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    HASHCAL_BDAT: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    HASHCAL: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    NEGATIVE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    HASHCAL_EXISTS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KNOWN_INDEX: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    POSTAT: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    VZSKZ: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FSH_SNST_STATUS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PROCE: Optional[SapNvarchar] = 000000000
    # SAP HANA type: NVARCHAR | Forced nullable
    CONC: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    CONT: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    COMP: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    OUTR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    DESP: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    DESP_DAT: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    DESP_CARGO: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PARE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PARE_DAT: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    PARE_CARGO: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PFM_CONTRACT: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    POHF_TYPE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    EQ_EINDT: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    EQ_WERKS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FIXPO: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    EKGRP_ALLOW: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    WERKS_ALLOW: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    CONTRACT_ALLOW: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PSTYP_ALLOW: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FIXPO_ALLOW: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KEY_ID_ALLOW: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    AUREL_ALLOW: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    DELPER_ALLOW: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    EINDT_ALLOW: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    LTSNR_ALLOW: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    OTB_LEVEL: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    OTB_COND_TYPE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KEY_ID: Optional[SapNvarchar] = 0000000000000000
    # SAP HANA type: DECIMAL | Forced nullable
    OTB_VALUE: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    OTB_CURR: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    OTB_RES_VALUE: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    OTB_SPEC_VALUE: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    SPR_RSN_PROFILE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    BUDG_TYPE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    OTB_STATUS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    OTB_REASON: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    CHECK_TYPE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    CON_OTB_REQ: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    CON_PREBOOK_LEV: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    CON_DISTR_LEV: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    HAS_CATALOG_RELEVANT_ITEMS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ZHDCONTRACT: Optional[SapNvarchar] = ""

class Ekpo(SapHanaBaseModel):
    """
    Model for SAP HANA table: EKPO
    Schema: SAPHANADB
    """

    # SAP HANA type: NVARCHAR | Primary key | Order by field
    MANDT: Key[SapNvarchar]
    # SAP HANA type: NVARCHAR | Primary key
    EBELN: Key[SapNvarchar]
    # SAP HANA type: NVARCHAR | Primary key
    EBELP: Key[SapNvarchar]
    # SAP HANA type: NVARCHAR | Forced nullable
    UNIQUEID: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    LOEKZ: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    STATU: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    AEDAT: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    TXZ01: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    MATNR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    EMATN: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    BUKRS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    WERKS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    LGORT: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    BEDNR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    MATKL: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    INFNR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    IDNLF: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    KTMNG: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    MENGE: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    MEINS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    BPRME: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    BPUMZ: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    BPUMN: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    UMREZ: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    UMREN: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    NETPR: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    PEINH: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    NETWR: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    BRTWR: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    AGDAT: Optional[SapNvarchar] = 00000000
    # SAP HANA type: DECIMAL | Forced nullable
    WEBAZ: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    MWSKZ: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    TXDAT_FROM: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    TXDAT: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    TAX_COUNTRY: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    BONUS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    INSMK: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SPINF: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PRSDR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SCHPR: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    MAHNZ: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    MAHN1: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    MAHN2: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    MAHN3: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    UEBTO: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    UEBTK: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    UNTTO: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    BWTAR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    BWTTY: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ABSKZ: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    AGMEM: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ELIKZ: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    EREKZ: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PSTYP: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KNTTP: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KZVBR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    VRTKZ: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    TWRKZ: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    WEPOS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    WEUNB: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    REPOS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    WEBRE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KZABS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    LABNR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KONNR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KTPNR: Optional[SapNvarchar] = 00000
    # SAP HANA type: NVARCHAR | Forced nullable
    ABDAT: Optional[SapNvarchar] = 00000000
    # SAP HANA type: DECIMAL | Forced nullable
    ABFTZ: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    ETFZ1: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    ETFZ2: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    KZSTU: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    NOTKZ: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    LMEIN: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    EVERS: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    ZWERT: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    NAVNW: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    ABMNG: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    PRDAT: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    BSTYP: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    EFFWR: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    XOBLR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KUNNR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ADRNR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    EKKOL: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SKTOF: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    STAFO: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    PLIFZ: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    NTGEW: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    GEWEI: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    TXJCD: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ETDRK: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SOBKZ: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ARSNR: Optional[SapNvarchar] = 0000000000
    # SAP HANA type: NVARCHAR | Forced nullable
    ARSPS: Optional[SapNvarchar] = 0000
    # SAP HANA type: NVARCHAR | Forced nullable
    INSNC: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SSQSS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ZGTYP: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    EAN11: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    BSTAE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    REVLV: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    GEBER: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FISTL: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FIPOS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KO_GSBER: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KO_PARGB: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KO_PRCTR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KO_PPRCTR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    MEPRF: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    BRGEW: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    VOLUM: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    VOLEH: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    INCO1: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    INCO2: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    VORAB: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KOLIF: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    LTSNR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PACKNO: Optional[SapNvarchar] = 0000000000
    # SAP HANA type: NVARCHAR | Forced nullable
    FPLNR: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    GNETWR: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    STAPO: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    UEBPO: Optional[SapNvarchar] = 00000
    # SAP HANA type: NVARCHAR | Forced nullable
    LEWED: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    EMLIF: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    LBLKZ: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SATNR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ATTYP: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    VSART: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    HANDOVERLOC: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KANBA: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ADRN2: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    DELIVERY_ADDRESS_TYPE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    CUOBJ: Optional[SapNvarchar] = 000000000000000000
    # SAP HANA type: NVARCHAR | Forced nullable
    XERSY: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    EILDT: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    DRDAT: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    DRUHR: Optional[SapNvarchar] = 000000
    # SAP HANA type: NVARCHAR | Forced nullable
    DRUNR: Optional[SapNvarchar] = 0000
    # SAP HANA type: NVARCHAR | Forced nullable
    AKTNR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ABELN: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ABELP: Optional[SapNvarchar] = 00000
    # SAP HANA type: DECIMAL | Forced nullable
    ANZPU: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    PUNEI: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SAISO: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SAISJ: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    EBON2: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    EBON3: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    EBONF: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    MLMAA: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    MHDRZ: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    ANFNR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ANFPS: Optional[SapNvarchar] = 00000
    # SAP HANA type: NVARCHAR | Forced nullable
    KZKFG: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    USEQU: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    UMSOK: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    BANFN: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    BNFPO: Optional[SapNvarchar] = 00000
    # SAP HANA type: NVARCHAR | Forced nullable
    MTART: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    UPTYP: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    UPVOR: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    KZWI1: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    KZWI2: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    KZWI3: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    KZWI4: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    KZWI5: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    KZWI6: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    SIKGR: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    MFZHI: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    FFZHI: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    RETPO: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    AUREL: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    BSGRU: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    LFRET: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    MFRGR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    NRFHG: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    J_1BNBM: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    J_1BMATUSE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    J_1BMATORG: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    J_1BOWNPRO: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    J_1BINDUST: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ABUEB: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    NLABD: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    NFABD: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    KZBWS: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    BONBA: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    FABKZ: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    LOADINGPOINT: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    J_1AINDXP: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    J_1AIDATEP: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    MPROF: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    EGLKZ: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KZTLF: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KZFME: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    RDPRF: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    TECHS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    CHG_SRV: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    CHG_FPLNR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    MFRPN: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    MFRNR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    EMNFR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    NOVET: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    AFNAM: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    TZONRC: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    IPRKZ: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    LEBRE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    BERID: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    XCONDITIONS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    APOMS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    CCOMP: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    GRANT_NBR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FKBER: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    STATUS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    RESLO: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KBLNR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KBLPOS: Optional[SapNvarchar] = 000
    # SAP HANA type: NVARCHAR | Forced nullable
    PS_PSP_PNR: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    KOSTL: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SAKTO: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    WEORA: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SRV_BAS_COM: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PRIO_URG: Optional[SapNvarchar] = 00
    # SAP HANA type: NVARCHAR | Forced nullable
    PRIO_REQ: Optional[SapNvarchar] = 000
    # SAP HANA type: NVARCHAR | Forced nullable
    EMPST: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    DIFF_INVOICE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    TRMRISK_RELEVANT: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    CREATIONDATE: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Order by field
    CREATIONTIME: SapNvarchar
    # SAP HANA type: NVARCHAR | Forced nullable
    VCM_CHAIN_CATEGORY: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SPE_ABGRU: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SPE_CRM_SO: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SPE_CRM_SO_ITEM: Optional[SapNvarchar] = 000000
    # SAP HANA type: NVARCHAR | Forced nullable
    SPE_CRM_REF_SO: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SPE_CRM_REF_ITEM: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SPE_CRM_FKREL: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SPE_CHNG_SYS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SPE_INSMK_SRC: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SPE_CQ_CTRLTYPE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SPE_CQ_NOCQ: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    REASON_CODE: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    CQU_SAR: Optional[SapDecimal] = 0
    # SAP HANA type: INTEGER | Forced nullable
    ANZSN: Optional[SapInteger] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    SPE_EWM_DTC: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    EXLIN: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    EXSNR: Optional[SapNvarchar] = 00000
    # SAP HANA type: NVARCHAR | Forced nullable
    EHTYP: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    RETPC: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    DPTYP: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    DPPCT: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    DPAMT: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    DPDAT: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    FLS_RSTO: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    EXT_RFX_NUMBER: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    EXT_RFX_ITEM: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    EXT_RFX_SYSTEM: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SRM_CONTRACT_ID: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SRM_CONTRACT_ITM: Optional[SapNvarchar] = 0000000000
    # SAP HANA type: NVARCHAR | Forced nullable
    GOODS_COUNT_CORRECTION: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    LIFEX: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    LIFEXPOS: Optional[SapNvarchar] = 000000
    # SAP HANA type: NVARCHAR | Forced nullable
    BLK_REASON_ID: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    BLK_REASON_TXT: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ITCONS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FIXMG: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    WABWE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    CMPL_DLV_ITM: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    INCO2_L: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    INCO3_L: Optional[SapNvarchar] = ""
    # SAP HANA type: VARBINARY | Nullable
    INCO2_KEY: Optional[SapVarbinary] = 00000000000000000000000000000000
    # SAP HANA type: VARBINARY | Nullable
    INCO3_KEY: Optional[SapVarbinary] = 00000000000000000000000000000000
    # SAP HANA type: VARBINARY | Nullable
    INCO4_KEY: Optional[SapVarbinary] = 00000000000000000000000000000000
    # SAP HANA type: NVARCHAR | Forced nullable
    STAWN: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ISVCO: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    GRWRT: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    SERVICEPERFORMER: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PRODUCTTYPE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    GR_BY_SES: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PRICE_CHANGE_IN_SES_ALLOWED: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    REQUESTFORQUOTATION: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    REQUESTFORQUOTATIONITEM: Optional[SapNvarchar] = 00000
    # SAP HANA type: NVARCHAR | Forced nullable
    RENEGOTIATION_STATUS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    STATUS_PCS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    STATUS_PMA: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    STATUS_DG: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    STATUS_SDS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    EXTMATERIALFORPURG: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PROCMT_HUB_SOURCE_SYSTEM: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    TARGET_VALUE: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    EXTERNALREFERENCEID: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    TC_AUT_DET: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    MANUAL_TC_REASON: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FISCAL_INCENTIVE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    TAX_SUBJECT_ST: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FISCAL_INCENTIVE_ID: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SF_TXJCD: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    DUMMY_EKPO_INCL_EEW_PS: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    EXPECTED_VALUE: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    LIMIT_AMOUNT: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    CONTRACT_FOR_LIMIT: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ENH_DATE1: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    ENH_DATE2: Optional[SapNvarchar] = 00000000
    # SAP HANA type: DECIMAL | Forced nullable
    ENH_PERCENT: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    ENH_NUMC1: Optional[SapNvarchar] = 0000000000
    # SAP HANA type: NVARCHAR | Forced nullable
    DATAAGING: Optional[SapNvarchar] = Field(alias="_DATAAGING", default=00000000)
    # SAP HANA type: NVARCHAR | Forced nullable
    CUPIT: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    CIGIT: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    MGOIT: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    TXS_BUSINESS_TRANSACTION: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    TXS_MATERIAL_USAGE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    TXS_USAGE_PURPOSE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    BEV1_NEGEN_ITEM: Optional[SapNvarchar] = Field(alias="/BEV1/NEGEN_ITEM", default="")
    # SAP HANA type: NVARCHAR | Forced nullable
    BEV1_NEDEPFREE: Optional[SapNvarchar] = Field(alias="/BEV1/NEDEPFREE", default="")
    # SAP HANA type: NVARCHAR | Forced nullable
    BEV1_NESTRUCCAT: Optional[SapNvarchar] = Field(alias="/BEV1/NESTRUCCAT", default="")
    # SAP HANA type: NVARCHAR | Forced nullable
    ADVCODE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    BUDGET_PD: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    EXCPE: Optional[SapNvarchar] = 00
    # SAP HANA type: NVARCHAR | Forced nullable
    FMFGUS_KEY: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    IUID_RELEVANT: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    MRPIND: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SGT_SCAT: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SGT_RCAT: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    TMS_REF_UUID: Optional[SapNvarchar] = ""
    # SAP HANA type: VARBINARY | Nullable
    TMS_SRC_LOC_KEY: Optional[SapVarbinary] = 00000000000000000000000000000000
    # SAP HANA type: VARBINARY | Nullable
    TMS_DES_LOC_KEY: Optional[SapVarbinary] = 00000000000000000000000000000000
    # SAP HANA type: NVARCHAR | Forced nullable
    WRF_CHARSTC1: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    WRF_CHARSTC2: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    WRF_CHARSTC3: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    REFSITE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    DMBE_OPTIONALITYKEY: Optional[SapNvarchar] = Field(alias="/DMBE/OPTIONALITYKEY", default=0000)
    # SAP HANA type: NVARCHAR | Forced nullable
    DMBE_OPTIONALITYFOR: Optional[SapNvarchar] = Field(alias="/DMBE/OPTIONALITYFOR", default=0000)
    # SAP HANA type: NVARCHAR | Forced nullable
    DMBE_CIMAX2: Optional[SapNvarchar] = Field(alias="/DMBE/CIMAX2", default="")
    # SAP HANA type: NVARCHAR | Forced nullable
    DMBE_ITEM_TYPE: Optional[SapNvarchar] = Field(alias="/DMBE/ITEM_TYPE", default="")
    # SAP HANA type: NVARCHAR | Forced nullable
    DMBE_EFFECTIVEDATEFROM: Optional[SapNvarchar] = Field(alias="/DMBE/EFFECTIVEDATEFROM", default=00000000)
    # SAP HANA type: NVARCHAR | Forced nullable
    DMBE_EFFECTIVEDATETO: Optional[SapNvarchar] = Field(alias="/DMBE/EFFECTIVEDATETO", default=00000000)
    # SAP HANA type: NVARCHAR | Forced nullable
    DMBE_OPTIONOF: Optional[SapNvarchar] = Field(alias="/DMBE/OPTIONOF", default=00000)
    # SAP HANA type: NVARCHAR | Forced nullable
    DMBE_ACCOUNTING_TYPE: Optional[SapNvarchar] = Field(alias="/DMBE/ACCOUNTING_TYPE", default="")
    # SAP HANA type: NVARCHAR | Forced nullable
    DMBE_FAS_CODE: Optional[SapNvarchar] = Field(alias="/DMBE/FAS_CODE", default="")
    # SAP HANA type: NVARCHAR | Forced nullable
    DMBE_SCHEDULING_DESK: Optional[SapNvarchar] = Field(alias="/DMBE/SCHEDULING_DESK", default="")
    # SAP HANA type: NVARCHAR | Forced nullable
    DMBE_COMPONENTFOR: Optional[SapNvarchar] = Field(alias="/DMBE/COMPONENTFOR", default=0000)
    # SAP HANA type: NVARCHAR | Forced nullable
    DMBE_MIXEDPRODUCT: Optional[SapNvarchar] = Field(alias="/DMBE/MIXEDPRODUCT", default="")
    # SAP HANA type: NVARCHAR | Forced nullable
    DMBE_POSTEDDATE: Optional[SapNvarchar] = Field(alias="/DMBE/POSTEDDATE", default=00000000)
    # SAP HANA type: NVARCHAR | Forced nullable
    DMBE_DEAL_POSTED: Optional[SapNvarchar] = Field(alias="/DMBE/DEAL_POSTED", default="")
    # SAP HANA type: NVARCHAR | Forced nullable
    DMBE_INVOICEUOM: Optional[SapNvarchar] = Field(alias="/DMBE/INVOICEUOM", default="")
    # SAP HANA type: NVARCHAR | Forced nullable
    ZAPCGK: Optional[SapNvarchar] = 0000
    # SAP HANA type: NVARCHAR | Forced nullable
    APCGK_EXTEND: Optional[SapNvarchar] = 0000000000
    # SAP HANA type: NVARCHAR | Forced nullable
    ZBAS_DATE: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    ZADATTYP: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ZSTART_DAT: Optional[SapNvarchar] = 00000000
    # SAP HANA type: DECIMAL | Forced nullable
    Z_DEV: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    ZINDANX: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ZLIMIT_DAT: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    NUMERATOR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    HASHCAL_BDAT: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    HASHCAL: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    NEGATIVE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    HASHCAL_EXISTS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KNOWN_INDEX: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SAPMP_GPOSE: Optional[SapNvarchar] = Field(alias="/SAPMP/GPOSE", default=00000)
    # SAP HANA type: NVARCHAR | Forced nullable
    ANGPN: Optional[SapNvarchar] = 000000
    # SAP HANA type: NVARCHAR | Forced nullable
    ADMOI: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ADPRI: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    LPRIO: Optional[SapNvarchar] = 00
    # SAP HANA type: NVARCHAR | Forced nullable
    ADACN: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    AFPNR: Optional[SapNvarchar] = 000000
    # SAP HANA type: NVARCHAR | Forced nullable
    BSARK: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    AUDAT: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    ANGNR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PNSTAT: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ADDNS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ASSIGNMENT_PRIORITY: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ARUN_GROUP_PRIO: Optional[SapNvarchar] = ""
    # SAP HANA type: INTEGER | Forced nullable
    ARUN_ORDER_PRIO: Optional[SapInteger] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    SERRU: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SERNP: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    DISUB_SOBKZ: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    DISUB_PSPNR: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    DISUB_KUNNR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    DISUB_VBELN: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    DISUB_POSNR: Optional[SapNvarchar] = 000000
    # SAP HANA type: NVARCHAR | Forced nullable
    DISUB_OWNER: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FSH_SEASON_YEAR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FSH_SEASON: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FSH_COLLECTION: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FSH_THEME: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FSH_ATP_DATE: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    FSH_VAS_REL: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FSH_VAS_PRNT_ID: Optional[SapNvarchar] = 00000
    # SAP HANA type: NVARCHAR | Forced nullable
    FSH_TRANSACTION: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FSH_ITEM_GROUP: Optional[SapNvarchar] = 00000
    # SAP HANA type: NVARCHAR | Forced nullable
    FSH_ITEM: Optional[SapNvarchar] = 00000
    # SAP HANA type: NVARCHAR | Forced nullable
    FSH_SS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FSH_GRID_COND_REC: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FSH_PSM_PFM_SPLIT: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    CNFM_QTY: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    FSH_PQR_UEPOS: Optional[SapNvarchar] = 000000
    # SAP HANA type: NVARCHAR | Forced nullable
    RFM_DIVERSION: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    RFM_SCC_INDICATOR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    STPAC: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    LGBZO: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    LGBZO_B: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ADDRNUM: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    CONSNUM: Optional[SapNvarchar] = 000
    # SAP HANA type: NVARCHAR | Forced nullable
    BORGR_MISS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    DEP_ID: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    BELNR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KBLPOS_CAB: Optional[SapNvarchar] = 000
    # SAP HANA type: NVARCHAR | Forced nullable
    KBLNR_COMP: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KBLPOS_COMP: Optional[SapNvarchar] = 000
    # SAP HANA type: NVARCHAR | Forced nullable
    WBS_ELEMENT: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    RFM_PSST_RULE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    RFM_PSST_GROUP: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    RFM_REF_DOC: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    RFM_REF_ITEM: Optional[SapNvarchar] = 000000
    # SAP HANA type: NVARCHAR | Forced nullable
    RFM_REF_ACTION: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    RFM_REF_SLITEM: Optional[SapNvarchar] = 0000
    # SAP HANA type: NVARCHAR | Forced nullable
    REF_ITEM: Optional[SapNvarchar] = 00000
    # SAP HANA type: NVARCHAR | Forced nullable
    SOURCE_ID: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SOURCE_KEY: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PUT_BACK: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    POL_ID: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    CONS_ORDER: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    IS_CATALOG_RELEVANT: Optional[SapNvarchar] = ""
    # SAP HANA type: VARBINARY | Forced nullable
    PFMTRANSDATAFOOTPRINTUUID: Optional[SapVarbinary] = 00000000000000000000000000000000

class Kna1(SapHanaBaseModel):
    """
    Model for SAP HANA table: KNA1
    Schema: SAPHANADB
    """

    # SAP HANA type: NVARCHAR | Primary key | Order by field
    MANDT: Key[SapNvarchar]
    # SAP HANA type: NVARCHAR | Primary key | Order by field
    KUNNR: Key[SapNvarchar]
    # SAP HANA type: NVARCHAR | Forced nullable
    LAND1: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    NAME1: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    NAME2: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ORT01: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PSTLZ: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    REGIO: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SORTL: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    STRAS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    TELF1: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    TELFX: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    XCPDK: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ADRNR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    MCOD1: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    MCOD2: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    MCOD3: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ANRED: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    AUFSD: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    BAHNE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    BAHNS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    BBBNR: Optional[SapNvarchar] = 0000000
    # SAP HANA type: NVARCHAR | Forced nullable
    BBSNR: Optional[SapNvarchar] = 00000
    # SAP HANA type: NVARCHAR | Forced nullable
    BEGRU: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    BRSCH: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    BUBKZ: Optional[SapNvarchar] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    DATLT: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ERDAT: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    ERNAM: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    EXABL: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FAKSD: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FISKN: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KNAZK: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KNRZA: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KONZS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KTOKD: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KUKLA: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    LIFNR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    LIFSD: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    LOCCO: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    LOEVM: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    NAME3: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    NAME4: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    NIELS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ORT02: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PFACH: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PSTL2: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    COUNC: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    CITYC: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    RPMKR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SPERR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SPRAS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    STCD1: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    STCD2: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    STKZA: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    STKZU: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    TELBX: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    TELF2: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    TELTX: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    TELX1: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    LZONE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    XZEMP: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    VBUND: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    STCEG: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    DEAR1: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    DEAR2: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    DEAR3: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    DEAR4: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    DEAR5: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    GFORM: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    BRAN1: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    BRAN2: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    BRAN3: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    BRAN4: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    BRAN5: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    EKONT: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    UMSAT: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    UMJAH: Optional[SapNvarchar] = 0000
    # SAP HANA type: NVARCHAR | Forced nullable
    UWAER: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    JMZAH: Optional[SapNvarchar] = 000000
    # SAP HANA type: NVARCHAR | Forced nullable
    JMJAH: Optional[SapNvarchar] = 0000
    # SAP HANA type: NVARCHAR | Forced nullable
    KATR1: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KATR2: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KATR3: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KATR4: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KATR5: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KATR6: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KATR7: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KATR8: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KATR9: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KATR10: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    STKZN: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    UMSA1: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    TXJCD: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PERIV: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ABRVW: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    INSPBYDEBI: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    INSPATDEBI: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KTOCD: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PFORT: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    WERKS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    DTAMS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    DTAWS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    DUEFL: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    HZUOR: Optional[SapNvarchar] = 00
    # SAP HANA type: NVARCHAR | Forced nullable
    SPERZ: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ETIKG: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    CIVVE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    MILVE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KDKG1: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KDKG2: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KDKG3: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KDKG4: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KDKG5: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    XKNZA: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FITYP: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    STCDT: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    STCD3: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    STCD4: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    STCD5: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    STCD6: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    XICMS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    XXIPI: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    XSUBT: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    CFOPC: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    TXLW1: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    TXLW2: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    CCC01: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    CCC02: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    CCC03: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    CCC04: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    BONDED_AREA_CONFIRM: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    DONATE_MARK: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    CONSOLIDATE_INVOICE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ALLOWANCE_TYPE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    EINVOICE_MODE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    B2C_INDICATOR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    CASSD: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KNURL: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    J_1KFREPRE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    J_1KFTBUS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    J_1KFTIND: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    CONFS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    UPDAT: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    UPTIM: Optional[SapNvarchar] = 000000
    # SAP HANA type: NVARCHAR | Forced nullable
    NODEL: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    DEAR6: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    DELIVERY_DATE_RULE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    CVP_XBLCK: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SUFRAMA: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    RG: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    EXP: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    UF: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    RGDATE: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    RIC: Optional[SapNvarchar] = 00000000000
    # SAP HANA type: NVARCHAR | Forced nullable
    RNE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    RNEDATE: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    CNAE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    LEGALNAT: Optional[SapNvarchar] = 0000
    # SAP HANA type: NVARCHAR | Forced nullable
    CRTN: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ICMSTAXPAY: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    INDTYP: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    TDT: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    COMSIZE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    DECREGPC: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PH_BIZ_STYLE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PAYTRSN: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KNA1_EEW_CUST: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    RULE_EXCLUSION: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KNA1_ADDR_EEW_CUST: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    DATA_CTRLR1: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    DATA_CTRLR2: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    DATA_CTRLR3: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    DATA_CTRLR4: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    DATA_CTRLR5: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    DATA_CTRLR6: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    DATA_CTRLR7: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    DATA_CTRLR8: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    DATA_CTRLR9: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    DATA_CTRLR10: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    XDCSET: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    VSO_R_PALHGT: Optional[SapDecimal] = Field(alias="/VSO/R_PALHGT", default=0)
    # SAP HANA type: NVARCHAR | Forced nullable
    VSO_R_PAL_UL: Optional[SapNvarchar] = Field(alias="/VSO/R_PAL_UL", default="")
    # SAP HANA type: NVARCHAR | Forced nullable
    VSO_R_PK_MAT: Optional[SapNvarchar] = Field(alias="/VSO/R_PK_MAT", default="")
    # SAP HANA type: NVARCHAR | Forced nullable
    VSO_R_MATPAL: Optional[SapNvarchar] = Field(alias="/VSO/R_MATPAL", default="")
    # SAP HANA type: NVARCHAR | Forced nullable
    VSO_R_I_NO_LYR: Optional[SapNvarchar] = Field(alias="/VSO/R_I_NO_LYR", default=00)
    # SAP HANA type: NVARCHAR | Forced nullable
    VSO_R_ONE_MAT: Optional[SapNvarchar] = Field(alias="/VSO/R_ONE_MAT", default="")
    # SAP HANA type: NVARCHAR | Forced nullable
    VSO_R_ONE_SORT: Optional[SapNvarchar] = Field(alias="/VSO/R_ONE_SORT", default="")
    # SAP HANA type: NVARCHAR | Forced nullable
    VSO_R_ULD_SIDE: Optional[SapNvarchar] = Field(alias="/VSO/R_ULD_SIDE", default=0)
    # SAP HANA type: NVARCHAR | Forced nullable
    VSO_R_LOAD_PREF: Optional[SapNvarchar] = Field(alias="/VSO/R_LOAD_PREF", default=0)
    # SAP HANA type: NVARCHAR | Forced nullable
    VSO_R_DPOINT: Optional[SapNvarchar] = Field(alias="/VSO/R_DPOINT", default="")
    # SAP HANA type: NVARCHAR | Forced nullable
    ALC: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PMT_OFFICE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FEE_SCHEDULE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    DUNS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    DUNS4: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SAM_UE_ID: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SAM_EFT_IND: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PSOFG: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PSOIS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PSON1: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PSON2: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PSON3: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PSOVN: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PSOTL: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PSOHS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PSOST: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PSOO1: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PSOO2: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PSOO3: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PSOO4: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PSOO5: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    J_1IEXCD: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    J_1IEXRN: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    J_1IEXRG: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    J_1IEXDI: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    J_1IEXCO: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    J_1ICSTNO: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    J_1ILSTNO: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    J_1IPANNO: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    J_1IEXCICU: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    AEDAT: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    USNAM: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    J_1ISERN: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    J_1IPANREF: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    GST_TDS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    J_3GETYP: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    J_3GREFTYP: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PSPNR: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    COAUFNR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    J_3GAGEXT: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    J_3GAGINT: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    J_3GAGDUMI: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    J_3GAGSTDI: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    LGORT: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KOKRS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KOSTL: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    J_3GABGLG: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    J_3GABGVG: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    J_3GABRART: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    J_3GSTDMON: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    J_3GSTDTAG: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    J_3GTAGMON: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    J_3GZUGTAG: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    J_3GMASCHB: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    J_3GMEINSA: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    J_3GKEINSA: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    J_3GBLSPER: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    J_3GKLEIVO: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    J_3GCALID: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    J_3GVMONAT: Optional[SapNvarchar] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    J_3GABRKEN: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    J_3GLABRECH: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    J_3GAABRECH: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    J_3GZUTVHLG: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    J_3GNEGMEN: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    J_3GFRISTLO: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    J_3GEMINBE: Optional[SapNvarchar] = 00000
    # SAP HANA type: NVARCHAR | Forced nullable
    J_3GFMGUE: Optional[SapNvarchar] = 00000
    # SAP HANA type: NVARCHAR | Forced nullable
    J_3GZUSCHUE: Optional[SapNvarchar] = 00000
    # SAP HANA type: NVARCHAR | Forced nullable
    J_3GSCHPRS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    J_3GINVSTA: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SAPCEM_DBER: Optional[SapNvarchar] = Field(alias="/SAPCEM/DBER", default="")
    # SAP HANA type: NVARCHAR | Forced nullable
    SAPCEM_KVMEQ: Optional[SapNvarchar] = Field(alias="/SAPCEM/KVMEQ", default="")
    # SAP HANA type: NVARCHAR | Forced nullable
    CARRID: Optional[SapNvarchar] = ""

class Knvv(SapHanaBaseModel):
    """
    Model for SAP HANA table: KNVV
    Schema: SAPHANADB
    """

    # SAP HANA type: NVARCHAR | Primary key | Order by field
    MANDT: Key[SapNvarchar]
    # SAP HANA type: NVARCHAR | Primary key | Order by field
    KUNNR: Key[SapNvarchar]
    # SAP HANA type: NVARCHAR | Primary key
    VKORG: Key[SapNvarchar]
    # SAP HANA type: NVARCHAR | Primary key
    VTWEG: Key[SapNvarchar]
    # SAP HANA type: NVARCHAR | Primary key
    SPART: Key[SapNvarchar]
    # SAP HANA type: NVARCHAR | Forced nullable
    ERNAM: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ERDAT: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    BEGRU: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    LOEVM: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    VERSG: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    AUFSD: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KALKS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KDGRP: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    BZIRK: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KONDA: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PLTYP: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    AWAHR: Optional[SapNvarchar] = 000
    # SAP HANA type: NVARCHAR | Forced nullable
    INCO1: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    INCO2: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    LIFSD: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    AUTLF: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    ANTLF: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    KZTLF: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KZAZU: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    CHSPL: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    LPRIO: Optional[SapNvarchar] = 00
    # SAP HANA type: NVARCHAR | Forced nullable
    EIKTO: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    VSBED: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FAKSD: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    MRNKZ: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PERFK: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PERRL: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KVAKZ: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    KVAWT: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    WAERS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KLABC: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KTGRD: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ZTERM: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    VWERK: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    VKGRP: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    VKBUR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    VSORT: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KVGR1: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KVGR2: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KVGR3: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KVGR4: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KVGR5: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    BOKRE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    BOIDT: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    KURST: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PRFRE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PRAT1: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PRAT2: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PRAT3: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PRAT4: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PRAT5: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PRAT6: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PRAT7: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PRAT8: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PRAT9: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PRATA: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KABSS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KKBER: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    CASSD: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    RDOFF: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    AGREL: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    MEGRU: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    UEBTO: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    UNTTO: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    UEBTK: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PVKSM: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PODKZ: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    PODTG: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    BLIND: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    CARRIER_NOTIF: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    CVP_XBLCK_V: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    INCOV: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    INCO2_L: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    INCO3_L: Optional[SapNvarchar] = ""
    # SAP HANA type: VARBINARY | Nullable
    INCO2_KEY: Optional[SapVarbinary] = 00000000000000000000000000000000
    # SAP HANA type: VARBINARY | Nullable
    INCO3_KEY: Optional[SapVarbinary] = 00000000000000000000000000000000
    # SAP HANA type: VARBINARY | Nullable
    INCO4_KEY: Optional[SapVarbinary] = 00000000000000000000000000000000
    # SAP HANA type: NVARCHAR | Forced nullable
    KNVV_EEW_CONTACT: Optional[SapNvarchar] = ""
    # SAP HANA type: VARBINARY | Nullable
    STATUS_OBJ_GUID: Optional[SapVarbinary] = 00000000000000000000000000000000
    # SAP HANA type: NVARCHAR | Forced nullable
    BILLPLAN_PROC: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KNVV_ADDR_EEW_CUST: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    BEV1_EMLGPFAND: Optional[SapNvarchar] = Field(alias="/BEV1/EMLGPFAND", default="")
    # SAP HANA type: NVARCHAR | Forced nullable
    BEV1_EMLGFORTS: Optional[SapNvarchar] = Field(alias="/BEV1/EMLGFORTS", default="")
    # SAP HANA type: NVARCHAR | Forced nullable
    J_1NBOESL: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FSH_KVGR6: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FSH_KVGR7: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FSH_KVGR8: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FSH_KVGR9: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FSH_KVGR10: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FSH_GRREG: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FSH_RESGY: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FSH_SC_CID: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FSH_VAS_DETC: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FSH_VAS_CG: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FSH_GRSGY: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FSH_SS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FSH_FRATE: Optional[SapNvarchar] = 000
    # SAP HANA type: NVARCHAR | Forced nullable
    FSH_FRATE_AGG_LEVEL: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FSH_MSOCDC: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FSH_MSOPID: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    RFM_PSST_RULE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    RFM_PSST_EXCLUDE: Optional[SapNvarchar] = ""

class Konp(SapHanaBaseModel):
    """
    Model for SAP HANA table: KONP
    Schema: SAPHANADB
    """

    # SAP HANA type: NVARCHAR | Primary key | Order by field
    MANDT: Key[SapNvarchar]
    # SAP HANA type: NVARCHAR | Primary key | Order by field
    KNUMH: Key[SapNvarchar]
    # SAP HANA type: NVARCHAR | Primary key
    KOPOS: Key[SapNvarchar]
    # SAP HANA type: NVARCHAR | Forced nullable
    KAPPL: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KSCHL: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KNUMT: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    STFKZ: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KZBZG: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    KSTBM: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    KONMS: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    KSTBW: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    KONWS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KRECH: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    KBETR: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    KONWA: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    KPEIN: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    KMEIN: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PRSCH: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    KUMZA: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    KUMNE: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    MEINS: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    MXWRT: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    GKWRT: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    PKWRT: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    FKWRT: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    RSWRT: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    KWAEH: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    UKBAS: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    KZNEP: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KUNNR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    LIFNR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    MWSK1: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    LOEVM_KO: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ZAEHK_IND: Optional[SapNvarchar] = 000
    # SAP HANA type: NVARCHAR | Forced nullable
    BOMAT: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    KBRUE: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    KSPAE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    BOSTA: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KNUMA_PI: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KNUMA_AG: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KNUMA_SQ: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    VALTG: Optional[SapNvarchar] = 00
    # SAP HANA type: NVARCHAR | Forced nullable
    VALDT: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    ZTERM: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ANZAUF: Optional[SapNvarchar] = 00
    # SAP HANA type: DECIMAL | Forced nullable
    MIKBAS: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    MXKBAS: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    KOMXWRT: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    KLF_STG: Optional[SapNvarchar] = 0000
    # SAP HANA type: NVARCHAR | Forced nullable
    KLF_KAL: Optional[SapNvarchar] = 0000
    # SAP HANA type: NVARCHAR | Forced nullable
    VKKAL: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    AKTNR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KNUMA_BO: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    MWSK2: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    VERTT: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    VERTN: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    VBEWA: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    MDFLG: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KFRST: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    UASTA: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    CNDN_CHGREASON: Optional[SapNvarchar] = ""
    # SAP HANA type: VARBINARY | Forced nullable
    CMMDTYPRCGCNDNFMLAUUID: Optional[SapVarbinary] = 00000000000000000000000000000000

class Koth030(SapHanaBaseModel):
    """
    Model for SAP HANA table: KOTH030
    Schema: SAPHANADB
    """

    # SAP HANA type: NVARCHAR | Primary key | Order by field
    MANDT: Key[SapNvarchar]
    # SAP HANA type: NVARCHAR | Primary key | Order by field
    KAPPL: Key[SapNvarchar]
    # SAP HANA type: NVARCHAR | Primary key
    KSCHL: Key[SapNvarchar]
    # SAP HANA type: NVARCHAR | Primary key
    AUART: Key[SapNvarchar]
    # SAP HANA type: NVARCHAR | Primary key
    WERKS: Key[SapNvarchar]
    # SAP HANA type: NVARCHAR | Primary key
    MATNR: Key[SapNvarchar]
    # SAP HANA type: NVARCHAR | Primary key
    DATBI: Key[SapNvarchar]
    # SAP HANA type: NVARCHAR | Forced nullable
    DATAB: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    KNUMH: Optional[SapNvarchar] = ""

class Lfa1(SapHanaBaseModel):
    """
    Model for SAP HANA table: LFA1
    Schema: SAPHANADB
    """

    # SAP HANA type: NVARCHAR | Primary key | Order by field
    MANDT: Key[SapNvarchar]
    # SAP HANA type: NVARCHAR | Primary key
    LIFNR: Key[SapNvarchar]
    # SAP HANA type: NVARCHAR | Forced nullable
    LAND1: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    NAME1: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    NAME2: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    NAME3: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    NAME4: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ORT01: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ORT02: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PFACH: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PSTL2: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PSTLZ: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    REGIO: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SORTL: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    STRAS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ADRNR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    MCOD1: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    MCOD2: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    MCOD3: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ANRED: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    BAHNS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    BBBNR: Optional[SapNvarchar] = 0000000
    # SAP HANA type: NVARCHAR | Forced nullable
    BBSNR: Optional[SapNvarchar] = 00000
    # SAP HANA type: NVARCHAR | Forced nullable
    BEGRU: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    BRSCH: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    BUBKZ: Optional[SapNvarchar] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    DATLT: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    DTAMS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    DTAWS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ERDAT: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    ERNAM: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ESRNR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KONZS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KTOKK: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KUNNR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    LNRZA: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    LOEVM: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SPERR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SPERM: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SPRAS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    STCD1: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    STCD2: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    STKZA: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    STKZU: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    TELBX: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    TELF1: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    TELF2: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    TELFX: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    TELTX: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    TELX1: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    XCPDK: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    XZEMP: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    VBUND: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FISKN: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    STCEG: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    STKZN: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SPERQ: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    GBORT: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    GBDAT: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    SEXKZ: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KRAUS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    REVDB: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    QSSYS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KTOCK: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PFORT: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    WERKS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    LTSNA: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    WERKR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PLKAL: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    DUEFL: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    TXJCD: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SPERZ: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SCACD: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SFRGR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    LZONE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    XLFZA: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    DLGRP: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FITYP: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    STCDT: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    REGSS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ACTSS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    STCD3: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    STCD4: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    STCD5: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    STCD6: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    IPISP: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    TAXBS: Optional[SapNvarchar] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    PROFS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    STGDL: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    EMNFR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    LFURL: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    J_1KFREPRE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    J_1KFTBUS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    J_1KFTIND: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    CONFS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    UPDAT: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    UPTIM: Optional[SapNvarchar] = 000000
    # SAP HANA type: NVARCHAR | Forced nullable
    NODEL: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    QSSYSDAT: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    PODKZB: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FISKU: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    STENR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    CARRIER_CONF: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    MIN_COMP: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    TERM_LI: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    CRC_NUM: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    CVP_XBLCK: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    WEORA: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    RG: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    EXP: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    UF: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    RGDATE: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    RIC: Optional[SapNvarchar] = 00000000000
    # SAP HANA type: NVARCHAR | Forced nullable
    RNE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    RNEDATE: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    CNAE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    LEGALNAT: Optional[SapNvarchar] = 0000
    # SAP HANA type: NVARCHAR | Forced nullable
    CRTN: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ICMSTAXPAY: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    INDTYP: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    TDT: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    COMSIZE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    DECREGPC: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ALLOWANCE_TYPE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PAYTRSN: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    LFA1_EEW_SUPP: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    DATA_CTRLR1: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    DATA_CTRLR2: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    DATA_CTRLR3: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    DATA_CTRLR4: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    DATA_CTRLR5: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    DATA_CTRLR6: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    DATA_CTRLR7: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    DATA_CTRLR8: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    DATA_CTRLR9: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    DATA_CTRLR10: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    XDCSET: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    DUMMY_LFA1_ADDR_INCL_EEW_PS: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    J_SC_CAPITAL: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    J_SC_CURRENCY: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ALC: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PMT_OFFICE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PPA_RELEVANT: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SAM_UE_ID: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SAM_EFT_IND: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PSOFG: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PSOIS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PSON1: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PSON2: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PSON3: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PSOVN: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PSOTL: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PSOHS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PSOST: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    BORGR_DATUN: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    BORGR_YEAUN: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    AU_CARRYING_ENT: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    AU_IND_UNDER_18: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    AU_PAYMENT_NOT_EXCEED_75: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    AU_WHOLLY_INP_TAXED: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    AU_PARTNER_WITHOUT_GAIN: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    AU_NOT_ENTITLED_ABN: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    AU_PAYMENT_EXEMPT: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    AU_PRIVATE_HOBBY: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    AU_DOMESTIC_NATURE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ADDR2_STREET: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ADDR2_HOUSE_NUM: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ADDR2_POST: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ADDR2_CITY: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ADDR2_COUNTRY: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    CATEG: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PARTNER_NAME: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PARTNER_UTR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    STATUS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    VFNUM: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    VFNID: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    CRN: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FR_OCCUPATION: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    J_1IEXCD: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    J_1IEXRN: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    J_1IEXRG: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    J_1IEXDI: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    J_1IEXCO: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    J_1ICSTNO: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    J_1ILSTNO: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    J_1IPANNO: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    J_1IEXCIVE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    J_1ISSIST: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    J_1IVTYP: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    J_1IVENCRE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    AEDAT: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    USNAM: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    J_1ISERN: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    J_1IPANREF: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    J_1IPANVALDT: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    J_1I_CUSTOMS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    J_1IDEDREF: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    VEN_CLASS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ENTPUB: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ESCRIT: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    DVALSS: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    FRMCSS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    CODCAE: Optional[SapNvarchar] = 00000
    # SAP HANA type: NVARCHAR | Forced nullable
    AUSDIV: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    SC_CAPITAL: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    SC_CURRENCY: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    TRANSPORT_CHAIN: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Order by field
    STAGING_TIME: SapDecimal
    # SAP HANA type: NVARCHAR | Forced nullable
    SCHEDULING_TYPE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SUBMI_RELEVANT: Optional[SapNvarchar] = ""

class Lfm1(SapHanaBaseModel):
    """
    Model for SAP HANA table: LFM1
    Schema: SAPHANADB
    """

    # SAP HANA type: NVARCHAR | Primary key | Order by field
    MANDT: Key[SapNvarchar]
    # SAP HANA type: NVARCHAR | Primary key
    LIFNR: Key[SapNvarchar]
    # SAP HANA type: NVARCHAR | Primary key
    EKORG: Key[SapNvarchar]
    # SAP HANA type: NVARCHAR | Forced nullable
    ERDAT: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    ERNAM: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SPERM: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    LOEVM: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    LFABC: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    WAERS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    VERKF: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    TELF1: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    MINBW: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    ZTERM: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    INCO1: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    INCO2: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    WEBRE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KZABS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KALSK: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KZAUT: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    EXPVZ: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ZOLLA: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    MEPRF: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    EKGRP: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    XERSY: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    PLIFZ: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    MRPPP: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    LFRHY: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    LIBES: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    LIPRE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    LISER: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    INCOV: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    INCO2_L: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    INCO3_L: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    WEORA: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PRFRE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    NRGEW: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    BOIND: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    BLIND: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KZRET: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SKRIT: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    BSTAE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    RDPRF: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    MEGRU: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    VENSL: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    BOPNR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    XERSR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    EIKTO: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ABUEB: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PAPRF: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    AGREL: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    XNBWY: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    VSBED: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    LEBRE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    BOLRE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    UMSAE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    VENDOR_RMA_REQ: Optional[SapNvarchar] = ""
    # SAP HANA type: VARBINARY | Nullable
    INCO2_KEY: Optional[SapVarbinary] = 00000000000000000000000000000000
    # SAP HANA type: VARBINARY | Nullable
    INCO3_KEY: Optional[SapVarbinary] = 00000000000000000000000000000000
    # SAP HANA type: VARBINARY | Nullable
    INCO4_KEY: Optional[SapVarbinary] = 00000000000000000000000000000000
    # SAP HANA type: NVARCHAR | Forced nullable
    LFM1_EEW_PS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    J_1NBOESL: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    AUBEL: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    VALID_PRO: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    HSCABS: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    HSCPE: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    HSCMIN: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    HSCMAX: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    FSH_SC_CID: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FSH_VAS_DETC: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    UPPRS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ACTIVITY_PROFIL: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    TRANSPORT_CHAIN: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Order by field
    STAGING_TIME: SapDecimal
    # SAP HANA type: NVARCHAR | Forced nullable
    DUMMY_LFM1_ADDR_INCL_EEW_PS: Optional[SapNvarchar] = ""

class Lfm2(SapHanaBaseModel):
    """
    Model for SAP HANA table: LFM2
    Schema: SAPHANADB
    """

    # SAP HANA type: NVARCHAR | Primary key | Order by field
    MANDT: Key[SapNvarchar]
    # SAP HANA type: NVARCHAR | Primary key
    LIFNR: Key[SapNvarchar]
    # SAP HANA type: NVARCHAR | Primary key
    EKORG: Key[SapNvarchar]
    # SAP HANA type: NVARCHAR | Primary key
    LTSNR: Key[SapNvarchar]
    # SAP HANA type: NVARCHAR | Primary key
    WERKS: Key[SapNvarchar]
    # SAP HANA type: NVARCHAR | Forced nullable
    ERDAT: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    ERNAM: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SPERM: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    LOEVM: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    LFABC: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    WAERS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    VERKF: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    TELF1: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    MINBW: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    ZTERM: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    INCO1: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    INCO2: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    WEBRE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KZABS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KALSK: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KZAUT: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    EXPVZ: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ZOLLA: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    MEPRF: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    EKGRP: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    XERSY: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    PLIFZ: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    MRPPP: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    LFRHY: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    LIBES: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    LIPRE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    LISER: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    INCOV: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    INCO2_L: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    INCO3_L: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    WEORA: Optional[SapNvarchar] = ""
    # SAP HANA type: VARBINARY | Nullable
    INCO2_KEY: Optional[SapVarbinary] = 00000000000000000000000000000000
    # SAP HANA type: VARBINARY | Nullable
    INCO3_KEY: Optional[SapVarbinary] = 00000000000000000000000000000000
    # SAP HANA type: VARBINARY | Nullable
    INCO4_KEY: Optional[SapVarbinary] = 00000000000000000000000000000000
    # SAP HANA type: NVARCHAR | Forced nullable
    DISPO: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    BOIND: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    BSTAE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    RDPRF: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    MEGRU: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    BOPNR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    XERSR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ABUEB: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PAPRF: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    XNBWY: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    LEBRE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    BOLRE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    UMSAE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    UPPRS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    TRANSPORT_CHAIN: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Order by field
    STAGING_TIME: SapDecimal

class Makt(SapHanaBaseModel):
    """
    Model for SAP HANA table: MAKT
    Schema: SAPHANADB
    """

    # SAP HANA type: NVARCHAR | Primary key | Order by field
    MANDT: Key[SapNvarchar]
    # SAP HANA type: NVARCHAR | Primary key | Order by field
    MATNR: Key[SapNvarchar]
    # SAP HANA type: NVARCHAR | Primary key
    SPRAS: Key[SapNvarchar]
    # SAP HANA type: NVARCHAR | Forced nullable
    MAKTX: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    MAKTG: Optional[SapNvarchar] = ""

class Mapl(SapHanaBaseModel):
    """
    Model for SAP HANA table: MAPL
    Schema: SAPHANADB
    """

    # SAP HANA type: NVARCHAR | Primary key | Order by field
    MANDT: Key[SapNvarchar]
    # SAP HANA type: NVARCHAR | Primary key | Order by field
    MATNR: Key[SapNvarchar]
    # SAP HANA type: NVARCHAR | Primary key
    WERKS: Key[SapNvarchar]
    # SAP HANA type: NVARCHAR | Primary key
    PLNTY: Key[SapNvarchar]
    # SAP HANA type: NVARCHAR | Primary key
    PLNNR: Key[SapNvarchar]
    # SAP HANA type: NVARCHAR | Primary key
    PLNAL: Key[SapNvarchar]
    # SAP HANA type: NVARCHAR | Primary key
    ZKRIZ: Key[SapNvarchar]
    # SAP HANA type: NVARCHAR | Primary key
    ZAEHL: Key[SapNvarchar]
    # SAP HANA type: NVARCHAR | Forced nullable
    DATUV: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    TECHV: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    AENNR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    LOEKZ: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PARKZ: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ANDAT: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    ANNAM: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    AEDAT: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    AENAM: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    LIFNR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KUNR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SUCHFELD: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    VBELN: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    POSNR: Optional[SapNvarchar] = 000000
    # SAP HANA type: NVARCHAR | Forced nullable
    PSPNR: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    VALID_TO: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    LOEKZ_INHERITED: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    VERSN: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    VERSN_SOURCE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    VERSN_SOURCE_ZKRIZ: Optional[SapNvarchar] = 0000000
    # SAP HANA type: NVARCHAR | Forced nullable
    MS_OBJECT: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    MS_OBJTYPE: Optional[SapNvarchar] = ""

class Mara(SapHanaBaseModel):
    """
    Model for SAP HANA table: MARA
    Schema: SAPHANADB
    """

    # SAP HANA type: NVARCHAR | Primary key | Order by field
    MANDT: Key[SapNvarchar]
    # SAP HANA type: NVARCHAR | Primary key
    MATNR: Key[SapNvarchar]
    # SAP HANA type: NVARCHAR | Forced nullable
    ERSDA: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Order by field
    CREATED_AT_TIME: SapNvarchar
    # SAP HANA type: NVARCHAR | Forced nullable
    ERNAM: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    LAEDA: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    AENAM: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    VPSTA: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PSTAT: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    LVORM: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    MTART: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    MBRSH: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    MATKL: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    BISMT: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    MEINS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    BSTME: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ZEINR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ZEIAR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ZEIVR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ZEIFO: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    AESZN: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    BLATT: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    BLANZ: Optional[SapNvarchar] = 000
    # SAP HANA type: NVARCHAR | Forced nullable
    FERTH: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FORMT: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    GROES: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    WRKST: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    NORMT: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    LABOR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    EKWSL: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    BRGEW: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    NTGEW: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    GEWEI: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    VOLUM: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    VOLEH: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    BEHVO: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    RAUBE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    TEMPB: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    DISST: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    TRAGR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    STOFF: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SPART: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KUNNR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    EANNR: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    WESCH: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    BWVOR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    BWSCL: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SAISO: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ETIAR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ETIFO: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ENTAR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    EAN11: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    NUMTP: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    LAENG: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    BREIT: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    HOEHE: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    MEABM: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PRDHA: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    AEKLK: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    CADKZ: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    QMPUR: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    ERGEW: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    ERGEI: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    ERVOL: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    ERVOE: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    GEWTO: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    VOLTO: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    VABME: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KZREV: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KZKFG: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    XCHPF: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    VHART: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    FUELG: Optional[SapDecimal] = 0
    # SAP HANA type: SMALLINT | Forced nullable
    STFAK: Optional[SapSmallInt] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    MAGRV: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    BEGRU: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    DATAB: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    LIQDT: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    SAISJ: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PLGTP: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    MLGUT: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    EXTWG: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SATNR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ATTYP: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KZKUP: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KZNFM: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PMATA: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    MSTAE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    MSTAV: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    MSTDE: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    MSTDV: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    TAKLV: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    RBNRM: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    MHDRZ: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    MHDHB: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    MHDLP: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    INHME: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    INHAL: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    VPREH: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    ETIAG: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    INHBR: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    CMETH: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    CUOBF: Optional[SapNvarchar] = 000000000000000000
    # SAP HANA type: NVARCHAR | Forced nullable
    KZUMW: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KOSCH: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SPROF: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    NRFHG: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    MFRPN: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    MFRNR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    BMATN: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    MPROF: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KZWSM: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SAITY: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PROFL: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    IHIVI: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ILOOS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SERLV: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KZGVH: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    XGCHP: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KZEFF: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    COMPL: Optional[SapNvarchar] = 00
    # SAP HANA type: NVARCHAR | Forced nullable
    IPRKZ: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    RDMHD: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PRZUS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    MTPOS_MARA: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    BFLME: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    MATFI: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    CMREL: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    BBTYP: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SLED_BBD: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    GTIN_VARIANT: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    GENNR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    RMATP: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    GDS_RELEVANT: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    WEORA: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    HUTYP_DFLT: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PILFERABLE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    WHSTC: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    WHMATGR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    HNDLCODE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    HAZMAT: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    HUTYP: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    TARE_VAR: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    MAXC: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    MAXC_TOL: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    MAXL: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    MAXB: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    MAXH: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    MAXDIM_UOM: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    HERKL: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    MFRGR: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Order by field
    QQTIME: SapDecimal
    # SAP HANA type: NVARCHAR | Forced nullable
    QQTIMEUOM: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    QGRP: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SERIAL: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PS_SMARTFORM: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    LOGUNIT: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    CWQREL: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    CWQPROC: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    CWQTOLGR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ADPROF: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    IPMIPPRODUCT: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ALLOW_PMAT_IGNO: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    MEDIUM: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    COMMODITY: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ANIMAL_ORIGIN: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    TEXTILE_COMP_IND: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    LAST_CHANGED_TIME: Optional[SapNvarchar] = 000000
    # SAP HANA type: NVARCHAR | Forced nullable
    MATNR_EXTERNAL: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    CHML_CMPLNC_RLVNCE_IND: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    LOGISTICAL_MAT_CATEGORY: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SALES_MATERIAL: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    IDENTIFICATION_TAG_TYPE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PRODUCTOID: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SDM_VERSION: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SGT_CSGR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SGT_COVSA: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SGT_STAT: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SGT_SCOPE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SGT_REL: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ANP: Optional[SapNvarchar] = 000000000
    # SAP HANA type: NVARCHAR | Forced nullable
    PSM_CODE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FSH_MG_AT1: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FSH_MG_AT2: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FSH_MG_AT3: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FSH_SEALV: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FSH_SEAIM: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FSH_SC_MID: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    DUMMY_PRD_INCL_EEW_PS: Optional[SapNvarchar] = ""
    # SAP HANA type: VARBINARY | Nullable
    SCM_MATID_GUID16: Optional[SapVarbinary] = 00000000000000000000000000000000
    # SAP HANA type: NVARCHAR | Forced nullable
    SCM_MATID_GUID22: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    SCM_MATURITY_DUR: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    SCM_SHLF_LFE_REQ_MIN: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    SCM_SHLF_LFE_REQ_MAX: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    SCM_PUOM: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    RMATP_PB: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PROD_SHAPE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    MO_PROFILE_ID: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    OVERHANG_TRESH: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    BRIDGE_TRESH: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    BRIDGE_MAX_SLOPE: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    HEIGHT_NONFLAT: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    HEIGHT_NONFLAT_UOM: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SCM_KITCOMP: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SCM_PROD_PAOOPT: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SCM_BOD_DEPLVL: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SCM_RESTRICT_INVBAL: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SCM_DRP_GL_STOCK: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SCM_EXCL_EXPEDITE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    NEWPROD_INDI: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PRD_STARTDT: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    PRD_ENDDT: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    INV_PLN_MODE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FLAGCLASS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    CWM_XCWMAT: Optional[SapNvarchar] = Field(alias="/CWM/XCWMAT", default="")
    # SAP HANA type: NVARCHAR | Forced nullable
    CWM_VALUM: Optional[SapNvarchar] = Field(alias="/CWM/VALUM", default="")
    # SAP HANA type: NVARCHAR | Forced nullable
    CWM_TOLGR: Optional[SapNvarchar] = Field(alias="/CWM/TOLGR", default="")
    # SAP HANA type: NVARCHAR | Forced nullable
    CWM_TARA: Optional[SapNvarchar] = Field(alias="/CWM/TARA", default="")
    # SAP HANA type: NVARCHAR | Forced nullable
    CWM_TARUM: Optional[SapNvarchar] = Field(alias="/CWM/TARUM", default="")
    # SAP HANA type: NVARCHAR | Forced nullable
    BEV1_LULEINH: Optional[SapNvarchar] = Field(alias="/BEV1/LULEINH", default=00000000)
    # SAP HANA type: NVARCHAR | Forced nullable
    BEV1_LULDEGRP: Optional[SapNvarchar] = Field(alias="/BEV1/LULDEGRP", default="")
    # SAP HANA type: NVARCHAR | Forced nullable
    BEV1_NESTRUCCAT: Optional[SapNvarchar] = Field(alias="/BEV1/NESTRUCCAT", default="")
    # SAP HANA type: NVARCHAR | Forced nullable
    DSD_SL_TOLTYP: Optional[SapNvarchar] = Field(alias="/DSD/SL_TOLTYP", default="")
    # SAP HANA type: NVARCHAR | Forced nullable
    DSD_SV_CNT_GRP: Optional[SapNvarchar] = Field(alias="/DSD/SV_CNT_GRP", default="")
    # SAP HANA type: NVARCHAR | Forced nullable
    DSD_VC_GROUP: Optional[SapNvarchar] = Field(alias="/DSD/VC_GROUP", default="")
    # SAP HANA type: DECIMAL | Forced nullable
    SAPMP_KADU: Optional[SapDecimal] = Field(alias="/SAPMP/KADU", default=0)
    # SAP HANA type: NVARCHAR | Forced nullable
    SAPMP_ABMEIN: Optional[SapNvarchar] = Field(alias="/SAPMP/ABMEIN", default="")
    # SAP HANA type: DECIMAL | Forced nullable
    SAPMP_KADP: Optional[SapDecimal] = Field(alias="/SAPMP/KADP", default=0)
    # SAP HANA type: DECIMAL | Forced nullable
    SAPMP_BRAD: Optional[SapDecimal] = Field(alias="/SAPMP/BRAD", default=0)
    # SAP HANA type: DECIMAL | Forced nullable
    SAPMP_SPBI: Optional[SapDecimal] = Field(alias="/SAPMP/SPBI", default=0)
    # SAP HANA type: DECIMAL | Forced nullable
    SAPMP_TRAD: Optional[SapDecimal] = Field(alias="/SAPMP/TRAD", default=0)
    # SAP HANA type: DECIMAL | Forced nullable
    SAPMP_KEDU: Optional[SapDecimal] = Field(alias="/SAPMP/KEDU", default=0)
    # SAP HANA type: DECIMAL | Forced nullable
    SAPMP_SPTR: Optional[SapDecimal] = Field(alias="/SAPMP/SPTR", default=0)
    # SAP HANA type: DECIMAL | Forced nullable
    SAPMP_FBDK: Optional[SapDecimal] = Field(alias="/SAPMP/FBDK", default=0)
    # SAP HANA type: DECIMAL | Forced nullable
    SAPMP_FBHK: Optional[SapDecimal] = Field(alias="/SAPMP/FBHK", default=0)
    # SAP HANA type: NVARCHAR | Forced nullable
    SAPMP_RILI: Optional[SapNvarchar] = Field(alias="/SAPMP/RILI", default="")
    # SAP HANA type: NVARCHAR | Forced nullable
    SAPMP_FBAK: Optional[SapNvarchar] = Field(alias="/SAPMP/FBAK", default="")
    # SAP HANA type: NVARCHAR | Forced nullable
    SAPMP_AHO: Optional[SapNvarchar] = Field(alias="/SAPMP/AHO", default=000)
    # SAP HANA type: DECIMAL | Forced nullable
    SAPMP_MIFRR: Optional[SapDecimal] = Field(alias="/SAPMP/MIFRR", default=0)
    # SAP HANA type: SMALLINT | Forced nullable
    STTPEC_SERTYPE: Optional[SapSmallInt] = Field(alias="/STTPEC/SERTYPE", default=0)
    # SAP HANA type: NVARCHAR | Forced nullable
    STTPEC_SYNCACT: Optional[SapNvarchar] = Field(alias="/STTPEC/SYNCACT", default="")
    # SAP HANA type: DECIMAL | Forced nullable
    STTPEC_SYNCTIME: Optional[SapDecimal] = Field(alias="/STTPEC/SYNCTIME", default=0)
    # SAP HANA type: NVARCHAR | Forced nullable
    STTPEC_SYNCCHG: Optional[SapNvarchar] = Field(alias="/STTPEC/SYNCCHG", default="")
    # SAP HANA type: NVARCHAR | Forced nullable
    STTPEC_COUNTRY_REF: Optional[SapNvarchar] = Field(alias="/STTPEC/COUNTRY_REF", default="")
    # SAP HANA type: NVARCHAR | Forced nullable
    STTPEC_PRDCAT: Optional[SapNvarchar] = Field(alias="/STTPEC/PRDCAT", default="")
    # SAP HANA type: NVARCHAR | Forced nullable
    VSO_R_TILT_IND: Optional[SapNvarchar] = Field(alias="/VSO/R_TILT_IND", default="")
    # SAP HANA type: NVARCHAR | Forced nullable
    VSO_R_STACK_IND: Optional[SapNvarchar] = Field(alias="/VSO/R_STACK_IND", default="")
    # SAP HANA type: NVARCHAR | Forced nullable
    VSO_R_BOT_IND: Optional[SapNvarchar] = Field(alias="/VSO/R_BOT_IND", default="")
    # SAP HANA type: NVARCHAR | Forced nullable
    VSO_R_TOP_IND: Optional[SapNvarchar] = Field(alias="/VSO/R_TOP_IND", default="")
    # SAP HANA type: NVARCHAR | Forced nullable
    VSO_R_STACK_NO: Optional[SapNvarchar] = Field(alias="/VSO/R_STACK_NO", default=000)
    # SAP HANA type: NVARCHAR | Forced nullable
    VSO_R_PAL_IND: Optional[SapNvarchar] = Field(alias="/VSO/R_PAL_IND", default="")
    # SAP HANA type: DECIMAL | Forced nullable
    VSO_R_PAL_OVR_D: Optional[SapDecimal] = Field(alias="/VSO/R_PAL_OVR_D", default=0)
    # SAP HANA type: DECIMAL | Forced nullable
    VSO_R_PAL_OVR_W: Optional[SapDecimal] = Field(alias="/VSO/R_PAL_OVR_W", default=0)
    # SAP HANA type: DECIMAL | Forced nullable
    VSO_R_PAL_B_HT: Optional[SapDecimal] = Field(alias="/VSO/R_PAL_B_HT", default=0)
    # SAP HANA type: DECIMAL | Forced nullable
    VSO_R_PAL_MIN_H: Optional[SapDecimal] = Field(alias="/VSO/R_PAL_MIN_H", default=0)
    # SAP HANA type: DECIMAL | Forced nullable
    VSO_R_TOL_B_HT: Optional[SapDecimal] = Field(alias="/VSO/R_TOL_B_HT", default=0)
    # SAP HANA type: NVARCHAR | Forced nullable
    VSO_R_NO_P_GVH: Optional[SapNvarchar] = Field(alias="/VSO/R_NO_P_GVH", default=00)
    # SAP HANA type: NVARCHAR | Forced nullable
    VSO_R_QUAN_UNIT: Optional[SapNvarchar] = Field(alias="/VSO/R_QUAN_UNIT", default="")
    # SAP HANA type: NVARCHAR | Forced nullable
    VSO_R_KZGVH_IND: Optional[SapNvarchar] = Field(alias="/VSO/R_KZGVH_IND", default="")
    # SAP HANA type: NVARCHAR | Forced nullable
    PACKCODE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    DG_PACK_STATUS: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    SRV_DURA: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    SRV_DURA_UOM: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SRV_SERWI: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SRV_ESCAL: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SOM_CYCLE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SOM_CYCLE_RULE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SOM_TC_SCHEMA: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SOM_CTR_AUTORENEWAL: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    MCOND: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    RETDELC: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    LOGLEV_RETO: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    NSNID: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ICFA: Optional[SapNvarchar] = ""
    # SAP HANA type: BIGINT | Forced nullable
    RIC_ID: Optional[SapBigInt] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    DFS_SENSITIVITY_KEY: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    DFS_MFRP2: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    OVLPN: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ADSPC_SPC: Optional[SapNvarchar] = 0
    # SAP HANA type: VARBINARY | Nullable
    VARID: Optional[SapVarbinary] = 00000000000000000000000000000000
    # SAP HANA type: NVARCHAR | Forced nullable
    MSBOOKPARTNO: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    TOLERANCE_TYPE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    DPCBT: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    XGRDT: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    IMATN: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PICNUM: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    BSTAT: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    COLOR_ATINN: Optional[SapNvarchar] = 0000000000
    # SAP HANA type: NVARCHAR | Forced nullable
    SIZE1_ATINN: Optional[SapNvarchar] = 0000000000
    # SAP HANA type: NVARCHAR | Forced nullable
    SIZE2_ATINN: Optional[SapNvarchar] = 0000000000
    # SAP HANA type: NVARCHAR | Forced nullable
    COLOR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SIZE1: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SIZE2: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FREE_CHAR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    CARE_CODE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    BRAND_ID: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FIBER_CODE1: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FIBER_PART1: Optional[SapNvarchar] = 000
    # SAP HANA type: NVARCHAR | Forced nullable
    FIBER_CODE2: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FIBER_PART2: Optional[SapNvarchar] = 000
    # SAP HANA type: NVARCHAR | Forced nullable
    FIBER_CODE3: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FIBER_PART3: Optional[SapNvarchar] = 000
    # SAP HANA type: NVARCHAR | Forced nullable
    FIBER_CODE4: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FIBER_PART4: Optional[SapNvarchar] = 000
    # SAP HANA type: NVARCHAR | Forced nullable
    FIBER_CODE5: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FIBER_PART5: Optional[SapNvarchar] = 000
    # SAP HANA type: NVARCHAR | Forced nullable
    FASHGRD: Optional[SapNvarchar] = ""

class Marc(SapHanaBaseModel):
    """
    Model for SAP HANA table: MARC
    Schema: SAPHANADB
    """

    # SAP HANA type: NVARCHAR | Primary key | Order by field
    MANDT: Key[SapNvarchar]
    # SAP HANA type: NVARCHAR | Primary key
    MATNR: Key[SapNvarchar]
    # SAP HANA type: NVARCHAR | Primary key
    WERKS: Key[SapNvarchar]
    # SAP HANA type: NVARCHAR | Forced nullable
    PSTAT: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    LVORM: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    BWTTY: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    XCHAR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    MMSTA: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    MMSTD: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    MAABC: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KZKRI: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    EKGRP: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    AUSME: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    DISPR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    DISMM: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    DISPO: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KZDIE: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    PLIFZ: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    WEBAZ: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    PERKZ: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    AUSSS: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    DISLS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    BESKZ: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SOBSL: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    MINBE: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    EISBE: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    BSTMI: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    BSTMA: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    BSTFE: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    BSTRF: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    MABST: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    LOSFX: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    SBDKZ: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    LAGPR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ALTSL: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KZAUS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    AUSDT: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    NFMAT: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KZBED: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    MISKZ: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FHORI: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PFREI: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FFREI: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    RGEKZ: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FEVOR: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    BEARZ: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    RUEZT: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    TRANZ: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    BASMG: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    DZEIT: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    MAXLZ: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    LZEIH: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KZPRO: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    GPMKZ: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    UEETO: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    UEETK: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    UNETO: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    WZEIT: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    ATPKZ: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    VZUSL: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    HERBL: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    INSMK: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    SPROZ: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    QUAZT: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    SSQSS: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    MPDAU: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    KZPPV: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KZDKZ: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    WSTGH: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    PRFRQ: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    NKMPR: Optional[SapNvarchar] = 00000000
    # SAP HANA type: DECIMAL | Forced nullable
    UMLMC: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    LADGR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    XCHPF: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    USEQU: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    LGRAD: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    AUFTL: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PLVAR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    OTYPE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    OBJID: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    MTVFP: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PERIV: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KZKFK: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    VRVEZ: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    VBAMG: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    VBEAZ: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    LIZYK: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    BWSCL: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KAUTB: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KORDB: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    STAWN: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    HERKL: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    HERKR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    EXPME: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    MTVER: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PRCTR: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    TRAME: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    MRPPP: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SAUFT: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FXHOR: Optional[SapNvarchar] = 000
    # SAP HANA type: NVARCHAR | Forced nullable
    VRMOD: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    VINT1: Optional[SapNvarchar] = 000
    # SAP HANA type: NVARCHAR | Forced nullable
    VINT2: Optional[SapNvarchar] = 000
    # SAP HANA type: NVARCHAR | Forced nullable
    VERKZ: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    STLAL: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    STLAN: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PLNNR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    APLAL: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    LOSGR: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    SOBSK: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FRTME: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    LGPRO: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    DISGR: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    KAUSF: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    QZGTP: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    QMATV: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    TAKZT: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    RWPRO: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    COPAM: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ABCIN: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    AWSLS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SERNP: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    CUOBJ: Optional[SapNvarchar] = 000000000000000000
    # SAP HANA type: NVARCHAR | Forced nullable
    STDPD: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SFEPR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    XMCNG: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    QSSYS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    LFRHY: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    RDPRF: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    VRBMT: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    VRBWK: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    VRBDT: Optional[SapNvarchar] = 00000000
    # SAP HANA type: DECIMAL | Forced nullable
    VRBFK: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    AUTRU: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PREFE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PRENC: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PRENO: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PREND: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    PRENE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PRENG: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    ITARK: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SERVG: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KZKUP: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    STRGR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    CUOBV: Optional[SapNvarchar] = 000000000000000000
    # SAP HANA type: NVARCHAR | Forced nullable
    LGFSB: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SCHGT: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    CCFIX: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    EPRIO: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    QMATA: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    RESVP: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    PLNTY: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    UOMGR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    UMRSL: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    ABFAC: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    SFCPF: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SHFLG: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SHZET: Optional[SapNvarchar] = 00
    # SAP HANA type: NVARCHAR | Forced nullable
    MDACH: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KZECH: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    MEGRU: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    MFRGR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SFTY_STK_METH: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PROFIL: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    VKUMC: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    VKTRW: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    KZAGL: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FVIDK: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FXPRU: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    LOGGR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FPRFM: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    GLGMG: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    VKGLG: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    INDUS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    MOWNR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    MOGRU: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    CASNR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    GPNUM: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    STEUC: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FABKZ: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    MATGR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    VSPVB: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    DPLFS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    DPLPU: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    DPLHO: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    MINLS: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    MAXLS: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    FIXLS: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    LTINC: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    COMPL: Optional[SapNvarchar] = 00
    # SAP HANA type: NVARCHAR | Forced nullable
    CONVT: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SHPRO: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    AHDIS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    DIBER: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KZPSP: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    OCMPF: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    APOKZ: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    MCRUE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    LFMON: Optional[SapNvarchar] = 00
    # SAP HANA type: NVARCHAR | Forced nullable
    LFGJA: Optional[SapNvarchar] = 0000
    # SAP HANA type: DECIMAL | Forced nullable
    EISLO: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    NCOST: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ROTATION_DATE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    UCHKZ: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    UCMAT: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    EXCISE_TAX_RLVNCE: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    TEMP_CTRL_MAX: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    TEMP_CTRL_MIN: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    TEMP_UOM: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    JITPRODNCONFPROFILE: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    BWESB: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    SGT_COVS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SGT_STATC: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SGT_SCOPE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SGT_MRPSI: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SGT_PRCM: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SGT_CHINT: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SGT_STK_PRT: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SGT_DEFSC: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SGT_MRP_ATP_STATUS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SGT_MMSTD: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    FSH_MG_ARUN_REQ: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FSH_SEAIM: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FSH_VAR_GROUP: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FSH_KZECH: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FSH_CALENDAR_GROUP: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ARUN_FIX_BATCH: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PPSKZ: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    CONS_PROCG: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Order by field
    GI_PR_TIME: SapDecimal
    # SAP HANA type: NVARCHAR | Forced nullable
    MULTIPLE_EKGRP: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    REF_SCHEMA: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    MIN_TROC: Optional[SapNvarchar] = 000
    # SAP HANA type: NVARCHAR | Forced nullable
    MAX_TROC: Optional[SapNvarchar] = 000
    # SAP HANA type: DECIMAL | Forced nullable
    TARGET_STOCK: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    NF_FLAG: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    CWM_UMLMC: Optional[SapDecimal] = Field(alias="/CWM/UMLMC", default=0)
    # SAP HANA type: DECIMAL | Forced nullable
    CWM_TRAME: Optional[SapDecimal] = Field(alias="/CWM/TRAME", default=0)
    # SAP HANA type: DECIMAL | Forced nullable
    CWM_BWESB: Optional[SapDecimal] = Field(alias="/CWM/BWESB", default=0)
    # SAP HANA type: VARBINARY | Nullable
    SCM_MATLOCID_GUID16: Optional[SapVarbinary] = 00000000000000000000000000000000
    # SAP HANA type: NVARCHAR | Forced nullable
    SCM_MATLOCID_GUID22: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    SCM_GRPRT: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    SCM_GIPRT: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    SCM_SCOST: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    SCM_RELDT: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    SCM_RRP_TYPE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SCM_HEUR_ID: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SCM_PACKAGE_ID: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    SCM_SSPEN: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    SCM_GET_ALERTS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SCM_RES_NET_NAME: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    SCM_CONHAP: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    SCM_HUNIT: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    SCM_CONHAP_OUT: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    SCM_HUNIT_OUT: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SCM_SHELF_LIFE_LOC: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    SCM_SHELF_LIFE_DUR: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    SCM_MATURITY_DUR: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    SCM_SHLF_LFE_REQ_MIN: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    SCM_SHLF_LFE_REQ_MAX: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    SCM_LSUOM: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    SCM_REORD_DUR: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    SCM_TARGET_DUR: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    SCM_TSTRID: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SCM_STRA1: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    SCM_PEG_PAST_ALERT: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    SCM_PEG_FUTURE_ALERT: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    SCM_PEG_STRATEGY: Optional[SapNvarchar] = 00
    # SAP HANA type: NVARCHAR | Forced nullable
    SCM_PEG_WO_ALERT_FST: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SCM_FIXPEG_PROD_SET: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SCM_WHATBOM: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SCM_RRP_SEL_GROUP: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SCM_INTSRC_PROF: Optional[SapNvarchar] = ""
    # SAP HANA type: SMALLINT | Forced nullable
    SCM_PRIO: Optional[SapSmallInt] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    SCM_MIN_PASS_AMOUNT: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    SCM_PROFID: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SCM_GES_MNG_USE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SCM_GES_BST_USE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ESPPFLG: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Order by field
    SCM_THRUPUT_TIME: SapDecimal
    # SAP HANA type: NVARCHAR | Forced nullable
    SCM_TPOP: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    SCM_SAFTY_V: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    SCM_PPSAFTYSTK: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    SCM_PPSAFTYSTK_V: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    SCM_REPSAFTY: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    SCM_REPSAFTY_V: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    SCM_REORD_V: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    SCM_MAXSTOCK_V: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    SCM_SCOST_PRCNT: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    SCM_PROC_COST: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    SCM_NDCOSTWE: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    SCM_NDCOSTWA: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    SCM_CONINP: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    CONF_GMSYNC: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SCM_IUNIT: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SCM_SFT_LOCK: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    DUMMY_PLNT_INCL_EEW_PS: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    SAPMP_TOLPRPL: Optional[SapDecimal] = Field(alias="/SAPMP/TOLPRPL", default=0)
    # SAP HANA type: DECIMAL | Forced nullable
    SAPMP_TOLPRMI: Optional[SapDecimal] = Field(alias="/SAPMP/TOLPRMI", default=0)
    # SAP HANA type: NVARCHAR | Forced nullable
    STTPEC_SERVALID: Optional[SapNvarchar] = Field(alias="/STTPEC/SERVALID", default=00000000)
    # SAP HANA type: NVARCHAR | Forced nullable
    VSO_R_PKGRP: Optional[SapNvarchar] = Field(alias="/VSO/R_PKGRP", default="")
    # SAP HANA type: NVARCHAR | Forced nullable
    VSO_R_LANE_NUM: Optional[SapNvarchar] = Field(alias="/VSO/R_LANE_NUM", default="")
    # SAP HANA type: NVARCHAR | Forced nullable
    VSO_R_PAL_VEND: Optional[SapNvarchar] = Field(alias="/VSO/R_PAL_VEND", default="")
    # SAP HANA type: NVARCHAR | Forced nullable
    VSO_R_FORK_DIR: Optional[SapNvarchar] = Field(alias="/VSO/R_FORK_DIR", default="")
    # SAP HANA type: NVARCHAR | Forced nullable
    IUID_RELEVANT: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    IUID_TYPE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    UID_IEA: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    DPCBT: Optional[SapNvarchar] = ""

class Mard(SapHanaBaseModel):
    """
    Model for SAP HANA table: MARD
    Schema: SAPHANADB
    """

    # SAP HANA type: NVARCHAR | Primary key | Order by field
    MANDT: Key[SapNvarchar]
    # SAP HANA type: NVARCHAR | Primary key | Order by field
    MATNR: Key[SapNvarchar]
    # SAP HANA type: NVARCHAR | Primary key
    WERKS: Key[SapNvarchar]
    # SAP HANA type: NVARCHAR | Primary key
    LGORT: Key[SapNvarchar]
    # SAP HANA type: NVARCHAR | Forced nullable
    PSTAT: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    LVORM: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    LFGJA: Optional[SapNvarchar] = 0000
    # SAP HANA type: NVARCHAR | Forced nullable
    LFMON: Optional[SapNvarchar] = 00
    # SAP HANA type: NVARCHAR | Forced nullable
    SPERR: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    LABST: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    UMLME: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    INSME: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    EINME: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    SPEME: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    RETME: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    VMLAB: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    VMUML: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    VMINS: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    VMEIN: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    VMSPE: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    VMRET: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    KZILL: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KZILQ: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KZILE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KZILS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KZVLL: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KZVLQ: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KZVLE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KZVLS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    DISKZ: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    LSOBS: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    LMINB: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    LBSTF: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    HERKL: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    EXPPG: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    EXVER: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    LGPBE: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    KLABS: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    KINSM: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    KEINM: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    KSPEM: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    DLINL: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    PRCTL: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ERSDA: Optional[SapNvarchar] = 00000000
    # SAP HANA type: DECIMAL | Forced nullable
    VKLAB: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    VKUML: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    LWMKB: Optional[SapNvarchar] = ""
    # SAP HANA type: DOUBLE | Forced nullable
    BSKRF: Optional[SapDouble] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    MDRUE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    MDJIN: Optional[SapNvarchar] = 0000
    # SAP HANA type: NVARCHAR | Forced nullable
    DUMMY_STL_INCL_EEW_PS: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    FSH_SALLOC_QTY_S: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    CWM_LABST: Optional[SapDecimal] = Field(alias="/CWM/LABST", default=0)
    # SAP HANA type: DECIMAL | Forced nullable
    CWM_INSME: Optional[SapDecimal] = Field(alias="/CWM/INSME", default=0)
    # SAP HANA type: DECIMAL | Forced nullable
    CWM_EINME: Optional[SapDecimal] = Field(alias="/CWM/EINME", default=0)
    # SAP HANA type: DECIMAL | Forced nullable
    CWM_SPEME: Optional[SapDecimal] = Field(alias="/CWM/SPEME", default=0)
    # SAP HANA type: DECIMAL | Forced nullable
    CWM_RETME: Optional[SapDecimal] = Field(alias="/CWM/RETME", default=0)
    # SAP HANA type: DECIMAL | Forced nullable
    CWM_UMLME: Optional[SapDecimal] = Field(alias="/CWM/UMLME", default=0)
    # SAP HANA type: DECIMAL | Forced nullable
    CWM_KLABS: Optional[SapDecimal] = Field(alias="/CWM/KLABS", default=0)
    # SAP HANA type: DECIMAL | Forced nullable
    CWM_KINSM: Optional[SapDecimal] = Field(alias="/CWM/KINSM", default=0)
    # SAP HANA type: DECIMAL | Forced nullable
    CWM_KEINM: Optional[SapDecimal] = Field(alias="/CWM/KEINM", default=0)
    # SAP HANA type: DECIMAL | Forced nullable
    CWM_KSPEM: Optional[SapDecimal] = Field(alias="/CWM/KSPEM", default=0)
    # SAP HANA type: DECIMAL | Forced nullable
    CWM_VMLAB: Optional[SapDecimal] = Field(alias="/CWM/VMLAB", default=0)
    # SAP HANA type: DECIMAL | Forced nullable
    CWM_VMINS: Optional[SapDecimal] = Field(alias="/CWM/VMINS", default=0)
    # SAP HANA type: DECIMAL | Forced nullable
    CWM_VMEIN: Optional[SapDecimal] = Field(alias="/CWM/VMEIN", default=0)
    # SAP HANA type: DECIMAL | Forced nullable
    CWM_VMSPE: Optional[SapDecimal] = Field(alias="/CWM/VMSPE", default=0)
    # SAP HANA type: DECIMAL | Forced nullable
    CWM_VMRET: Optional[SapDecimal] = Field(alias="/CWM/VMRET", default=0)
    # SAP HANA type: DECIMAL | Forced nullable
    CWM_VMUML: Optional[SapDecimal] = Field(alias="/CWM/VMUML", default=0)

class Mast(SapHanaBaseModel):
    """
    Model for SAP HANA table: MAST
    Schema: SAPHANADB
    """

    # SAP HANA type: NVARCHAR | Primary key | Order by field
    MANDT: Key[SapNvarchar]
    # SAP HANA type: NVARCHAR | Primary key | Order by field
    MATNR: Key[SapNvarchar]
    # SAP HANA type: NVARCHAR | Primary key
    WERKS: Key[SapNvarchar]
    # SAP HANA type: NVARCHAR | Primary key
    STLAN: Key[SapNvarchar]
    # SAP HANA type: NVARCHAR | Primary key
    STLNR: Key[SapNvarchar]
    # SAP HANA type: NVARCHAR | Primary key
    STLAL: Key[SapNvarchar]
    # SAP HANA type: DECIMAL | Forced nullable
    LOSVN: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    LOSBS: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    ANDAT: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    ANNAM: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    AEDAT: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    AENAM: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    CSLTY: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    MATERIAL_BOM_KEY: Optional[SapNvarchar] = ""

class Matdoc(SapHanaBaseModel):
    """
    Model for SAP HANA table: MATDOC
    Schema: SAPHANADB
    """

    # SAP HANA type: NVARCHAR | Order by field
    MANDT: SapNvarchar
    # SAP HANA type: VARBINARY | Order by field
    KEY1: SapVarbinary
    # SAP HANA type: VARBINARY | Forced nullable
    KEY2: Optional[SapVarbinary] = 00000000
    # SAP HANA type: VARBINARY | Forced nullable
    KEY3: Optional[SapVarbinary] = 0000000000
    # SAP HANA type: VARBINARY | Forced nullable
    KEY4: Optional[SapVarbinary] = 00
    # SAP HANA type: VARBINARY | Forced nullable
    KEY5: Optional[SapVarbinary] = 00
    # SAP HANA type: VARBINARY | Forced nullable
    KEY6: Optional[SapVarbinary] = 00
    # SAP HANA type: NVARCHAR | Forced nullable
    RECORD_TYPE: Optional[SapNvarchar] = ""
    # SAP HANA type: INTEGER | Forced nullable
    HEADER_COUNTER: Optional[SapInteger] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    MATBF: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    WERKS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    LGORT_SID: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    CHARG_SID: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    LIFNR_SID: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    MAT_KDAUF: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    MAT_KDPOS: Optional[SapNvarchar] = 000000
    # SAP HANA type: NVARCHAR | Forced nullable
    MAT_PSPNR: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    KUNNR_SID: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SOBKZ: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    LBBSA_SID: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    DISUB_OWNER_SID: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    RESOURCENAME_SID: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    BUKRS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    CHARG_WHS_SG: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    MENGU: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    WERTU: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    VBOBJ_SG: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KZBWS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    BSTAUS_SG: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    BSTTYP_SG: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KALNR: Optional[SapNvarchar] = 000000000000
    # SAP HANA type: NVARCHAR | Forced nullable
    BERID: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    WAERS: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    DMBTR: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    BNBTR: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    BUALT: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    DMBUM: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    EXBWR: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    VKWRT: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    EXVKW: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    SALK3: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    VKWRA: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    J_1BEXBASE: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    STOCK_VKWRT: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    DMBTR_STOCK: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    DMBTR_CONS: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    MEINS: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    MENGE: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    LBKUM: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    STOCK_QTY: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    CONSUMPTION_QTY: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    ERFME: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    ERFMG: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    BPRME: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    BPMNG: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    BSTME: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    BSTMG: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    LSMEH: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    LSMNG: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    PBAMG: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    CURRENCY_A1: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    PRICE_A1: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    PRICE_SOURCE_A1: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    STOCK_VALUE_A1: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    CONS_VALUE_A1: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    CWM_MENGE: Optional[SapDecimal] = Field(alias="/CWM/MENGE", default=0)
    # SAP HANA type: NVARCHAR | Forced nullable
    CWM_MEINS: Optional[SapNvarchar] = Field(alias="/CWM/MEINS", default="")
    # SAP HANA type: DECIMAL | Forced nullable
    CWM_ERFMG: Optional[SapDecimal] = Field(alias="/CWM/ERFMG", default=0)
    # SAP HANA type: NVARCHAR | Forced nullable
    CWM_ERFME: Optional[SapNvarchar] = Field(alias="/CWM/ERFME", default="")
    # SAP HANA type: DECIMAL | Forced nullable
    CWM_STOCK_QTY: Optional[SapDecimal] = Field(alias="/CWM/STOCK_QTY", default=0)
    # SAP HANA type: DECIMAL | Forced nullable
    CWM_CONSUMPTION_QTY: Optional[SapDecimal] = Field(alias="/CWM/CONSUMPTION_QTY", default=0)
    # SAP HANA type: NVARCHAR | Forced nullable
    CWM_MEINS_SID: Optional[SapNvarchar] = Field(alias="/CWM/MEINS_SID", default="")
    # SAP HANA type: NVARCHAR | Forced nullable
    UMMAB_CID: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    UMWRK_CID: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    LGORT_CID: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    CHARG_CID: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    LIFNR_CID: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    MAT_KDAUF_CID: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    MAT_KDPOS_CID: Optional[SapNvarchar] = 000000
    # SAP HANA type: NVARCHAR | Forced nullable
    MAT_PSPNR_CID: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    KUNNR_CID: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    UMSOK_CID: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    LBBSA_CID: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    DISUB_OWNER_CID: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    RESOURCENAME_CID: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    UMBUK_CG: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    CHARG_WHS_CG: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    UMMEN_CG: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    UMWER_CG: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    VBOBJ_CG: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    UMKZBWS_CG: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    BSTAUS_CG: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    BSTTYP_CG: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KALNR_CG: Optional[SapNvarchar] = 000000000000
    # SAP HANA type: NVARCHAR | Forced nullable
    BUDAT: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    CPUDT: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    CPUTM: Optional[SapNvarchar] = 000000
    # SAP HANA type: NVARCHAR | Forced nullable
    YEARDAY_BUDAT: Optional[SapNvarchar] = 0000000
    # SAP HANA type: NVARCHAR | Forced nullable
    YEARWEEK_BUDAT: Optional[SapNvarchar] = 000000
    # SAP HANA type: NVARCHAR | Forced nullable
    YEARMONTH_BUDAT: Optional[SapNvarchar] = 000000
    # SAP HANA type: NVARCHAR | Forced nullable
    YEARQUARTER_BUDAT: Optional[SapNvarchar] = 00000
    # SAP HANA type: NVARCHAR | Forced nullable
    YEAR_BUDAT: Optional[SapNvarchar] = 0000
    # SAP HANA type: NVARCHAR | Forced nullable
    QUARTER_BUDAT: Optional[SapNvarchar] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    MONTH_BUDAT: Optional[SapNvarchar] = 00
    # SAP HANA type: NVARCHAR | Forced nullable
    WEEK_BUDAT: Optional[SapNvarchar] = 00
    # SAP HANA type: NVARCHAR | Forced nullable
    DAY_BUDAT: Optional[SapNvarchar] = 000
    # SAP HANA type: NVARCHAR | Forced nullable
    WEEKDAY_BUDAT: Optional[SapNvarchar] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    BLDAT: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    AEDAT: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    SPE_BUDAT_UHR: Optional[SapNvarchar] = 000000
    # SAP HANA type: NVARCHAR | Forced nullable
    SPE_BUDAT_ZONE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PERIV: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    GJAHR: Optional[SapNvarchar] = 0000
    # SAP HANA type: NVARCHAR | Forced nullable
    GJPER: Optional[SapNvarchar] = 0000000
    # SAP HANA type: NVARCHAR | Forced nullable
    GJPER_CURR_PER: Optional[SapNvarchar] = 0000000
    # SAP HANA type: NVARCHAR | Forced nullable
    VFDAT: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    DABRBZ: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    DABRZ: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    HSDAT: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    MBLNR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    MJAHR: Optional[SapNvarchar] = 0000
    # SAP HANA type: NVARCHAR | Forced nullable
    ZEILE: Optional[SapNvarchar] = 0000
    # SAP HANA type: NVARCHAR | Forced nullable
    LINE_ID: Optional[SapNvarchar] = 000000
    # SAP HANA type: NVARCHAR | Forced nullable
    PARENT_ID: Optional[SapNvarchar] = 000000
    # SAP HANA type: NVARCHAR | Forced nullable
    LINE_DEPTH: Optional[SapNvarchar] = 00
    # SAP HANA type: NVARCHAR | Forced nullable
    MAA_URZEI: Optional[SapNvarchar] = 0000
    # SAP HANA type: NVARCHAR | Forced nullable
    KDAUF: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KDPOS: Optional[SapNvarchar] = 000000
    # SAP HANA type: NVARCHAR | Forced nullable
    KDEIN: Optional[SapNvarchar] = 0000
    # SAP HANA type: NVARCHAR | Forced nullable
    EBELN: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    EBELP: Optional[SapNvarchar] = 00000
    # SAP HANA type: NVARCHAR | Forced nullable
    LFBJA: Optional[SapNvarchar] = 0000
    # SAP HANA type: NVARCHAR | Forced nullable
    LFBNR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    LFPOS: Optional[SapNvarchar] = 0000
    # SAP HANA type: NVARCHAR | Forced nullable
    SJAHR: Optional[SapNvarchar] = 0000
    # SAP HANA type: NVARCHAR | Forced nullable
    SMBLN: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SMBLP: Optional[SapNvarchar] = 0000
    # SAP HANA type: NVARCHAR | Forced nullable
    AUFNR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ANLN1: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ANLN2: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    BELNR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    BUZEI: Optional[SapNvarchar] = 000
    # SAP HANA type: NVARCHAR | Forced nullable
    BELUM: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    BUZUM: Optional[SapNvarchar] = 000
    # SAP HANA type: NVARCHAR | Forced nullable
    RSNUM: Optional[SapNvarchar] = 0000000000
    # SAP HANA type: NVARCHAR | Forced nullable
    RSPOS: Optional[SapNvarchar] = 0000
    # SAP HANA type: NVARCHAR | Forced nullable
    TBNUM: Optional[SapNvarchar] = 0000000000
    # SAP HANA type: NVARCHAR | Forced nullable
    TBPOS: Optional[SapNvarchar] = 0000
    # SAP HANA type: NVARCHAR | Forced nullable
    UBNUM: Optional[SapNvarchar] = 0000000000
    # SAP HANA type: NVARCHAR | Forced nullable
    TANUM: Optional[SapNvarchar] = 0000000000
    # SAP HANA type: NVARCHAR | Forced nullable
    URZEI: Optional[SapNvarchar] = 0000
    # SAP HANA type: NVARCHAR | Forced nullable
    XBLNR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    VBELN_IM: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    VBELP_IM: Optional[SapNvarchar] = 000000
    # SAP HANA type: NVARCHAR | Forced nullable
    LE_VBELN: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SPE_LOGSYS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SPE_MDNUM_EWM: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    CANCELLED: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    CANCELLATION_TYPE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    REVERSAL_MOVEMENT: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SERVICE_DOC_TYPE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SERVICE_DOC_ID: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SERVICE_DOC_ITEM_ID: Optional[SapNvarchar] = 000000
    # SAP HANA type: NVARCHAR | Forced nullable
    EWM_LGNUM: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    EWM_GMDOC: Optional[SapNvarchar] = 000000000000
    # SAP HANA type: NVARCHAR | Forced nullable
    EWM_LGPLA: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    XSTOR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    BWART: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    XAUTO: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    MATNR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    LGORT: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    CHARG: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    BWTAR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    INSMK: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ZUSCH: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ZUSTD: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    LIFNR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KUNNR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PLPLA: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SHKZG: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SHKUM: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ELIKZ: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SGTXT: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    EQUNR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    WEMPF: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ABLAD: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    GSBER: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KOKRS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PARGB: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PARBU: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KOSTL: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PROJN: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    XSKST: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    XSAUF: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    XSPRO: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    XSERG: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    XRUEM: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    XRUEJ: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KZEAR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KZSTR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    UMMAT: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    UMCHA: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    UMLGO: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    UMZST: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    UMZUS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KZBEW: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KZVBR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KZZUG: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    WEUNB: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    PALAN: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    LGNUM: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    LGTYP: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    LGPLA: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    BESTQ: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    BWLVS: Optional[SapNvarchar] = 000
    # SAP HANA type: NVARCHAR | Forced nullable
    XBLVS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    VSCHN: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    NSCHN: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    DYPLA: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    TBPRI: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    WEANZ: Optional[SapNvarchar] = 000
    # SAP HANA type: NVARCHAR | Forced nullable
    GRUND: Optional[SapNvarchar] = 0000
    # SAP HANA type: NVARCHAR | Forced nullable
    EVERS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    EVERE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    IMKEY: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KSTRG: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PAOBJNR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PRCTR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PS_PSP_PNR: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    NPLNR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    AUFPL: Optional[SapNvarchar] = 0000000000
    # SAP HANA type: NVARCHAR | Forced nullable
    APLZL: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    AUFPS: Optional[SapNvarchar] = 0000
    # SAP HANA type: NVARCHAR | Forced nullable
    VPTNR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FIPOS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SAKTO: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    XWSBR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    EMLIF: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    AKTNR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ZEKKN: Optional[SapNvarchar] = 00
    # SAP HANA type: NVARCHAR | Forced nullable
    CUOBJ_CH: Optional[SapNvarchar] = 000000000000000000
    # SAP HANA type: NVARCHAR | Forced nullable
    PPRCTR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    RSART: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    GEBER: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FISTL: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    BUSTM: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    BUSTW: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    VPRSV: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FKBER: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    XBEAU: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    QINSPST: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    MWSKZ: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    TXJCD: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    EMATN: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    J_1AGIRUPD: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    VKMWS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    BERKZ: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    XWOFF: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    BEMOT: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PRZNR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    LLIEF: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    LSTAR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    XOBEW: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    GRANT_NBR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ZUSTD_T156M: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SPE_GTS_STOCK_TY: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KBLNR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KBLPOS: Optional[SapNvarchar] = 000
    # SAP HANA type: NVARCHAR | Forced nullable
    XMACC: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    UMMAB: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    UMBAR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    UMWRK: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    UMSOK: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SGT_SCAT: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SGT_UMSCAT: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SGT_RCAT: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    DISUB_OWNER: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    COMPL_MARK: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FZGLS_MARK: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ETANP_MARK: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    POPUP_MARK: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    XSAUT: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SERVICEPERFORMER: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PERNR: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    KNTTP_GR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    WORK_ITEM_ID: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FBUDA: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    DUMMY_INCL_EEW_COBL: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FSH_SEASON_YEAR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FSH_SEASON: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FSH_COLLECTION: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FSH_THEME: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    WRF_CHARSTC1: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    WRF_CHARSTC2: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    WRF_CHARSTC3: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    DUMMY_MATDOC_INCL_EEW_PS: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    OINAVNW: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    OICONDCOD: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    CONDI: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ASS_PSPNR: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    BLART: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    BLAUM: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    TCODE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    BKTXT: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    FRATH: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    FRBNR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    WEVER: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    XABLN: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    AWSYS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    BLA2D: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    BFWMS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    VGART: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    USNAM: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    TCODE2: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    EXNUM: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    GTS_CUSREF_NO: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FLS_RSTO: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    MSR_ACTIVE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    XCOMPL: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KNUMV: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    DATAAGING: Optional[SapNvarchar] = Field(alias="_DATAAGING", default=00000000)
    # SAP HANA type: NVARCHAR | Forced nullable
    XPRINT: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    LMBMV: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    PABPM: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    XFMAT: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KNBDR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    NROFLABELS: Optional[SapNvarchar] = 0000

class Mbew(SapHanaBaseModel):
    """
    Model for SAP HANA table: MBEW
    Schema: SAPHANADB
    """

    # SAP HANA type: NVARCHAR | Primary key | Order by field
    MANDT: Key[SapNvarchar]
    # SAP HANA type: NVARCHAR | Primary key
    MATNR: Key[SapNvarchar]
    # SAP HANA type: NVARCHAR | Primary key
    BWKEY: Key[SapNvarchar]
    # SAP HANA type: NVARCHAR | Primary key
    BWTAR: Key[SapNvarchar]
    # SAP HANA type: NVARCHAR | Forced nullable
    LVORM: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    LBKUM: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    SALK3: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    VPRSV: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    VERPR: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    STPRS: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    PEINH: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    BKLAS: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    SALKV: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    VMKUM: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    VMSAL: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    VMVPR: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    VMVER: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    VMSTP: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    VMPEI: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    VMBKL: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    VMSAV: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    VJKUM: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    VJSAL: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    VJVPR: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    VJVER: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    VJSTP: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    VJPEI: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    VJBKL: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    VJSAV: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    LFGJA: Optional[SapNvarchar] = 0000
    # SAP HANA type: NVARCHAR | Forced nullable
    LFMON: Optional[SapNvarchar] = 00
    # SAP HANA type: NVARCHAR | Forced nullable
    BWTTY: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    STPRV: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    LAEPR: Optional[SapNvarchar] = 00000000
    # SAP HANA type: DECIMAL | Forced nullable
    ZKPRS: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    ZKDAT: Optional[SapNvarchar] = 00000000
    # SAP HANA type: DECIMAL | Order by field
    TIMESTAMP: SapDecimal
    # SAP HANA type: DECIMAL | Forced nullable
    BWPRS: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    BWPRH: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    VJBWS: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    VJBWH: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    VVJSL: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    VVJLB: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    VVMLB: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    VVSAL: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    ZPLPR: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    ZPLP1: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    ZPLP2: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    ZPLP3: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    ZPLD1: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    ZPLD2: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    ZPLD3: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    PPERZ: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PPERL: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PPERV: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KALKZ: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KALKL: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KALKV: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KALSC: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    XLIFO: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    MYPOL: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    BWPH1: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    BWPS1: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    ABWKZ: Optional[SapNvarchar] = 00
    # SAP HANA type: NVARCHAR | Forced nullable
    PSTAT: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KALN1: Optional[SapNvarchar] = 000000000000
    # SAP HANA type: NVARCHAR | Forced nullable
    KALNR: Optional[SapNvarchar] = 000000000000
    # SAP HANA type: NVARCHAR | Forced nullable
    BWVA1: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    BWVA2: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    BWVA3: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    VERS1: Optional[SapNvarchar] = 00
    # SAP HANA type: NVARCHAR | Forced nullable
    VERS2: Optional[SapNvarchar] = 00
    # SAP HANA type: NVARCHAR | Forced nullable
    VERS3: Optional[SapNvarchar] = 00
    # SAP HANA type: NVARCHAR | Forced nullable
    HRKFT: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KOSGR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PPRDZ: Optional[SapNvarchar] = 000
    # SAP HANA type: NVARCHAR | Forced nullable
    PPRDL: Optional[SapNvarchar] = 000
    # SAP HANA type: NVARCHAR | Forced nullable
    PPRDV: Optional[SapNvarchar] = 000
    # SAP HANA type: NVARCHAR | Forced nullable
    PDATZ: Optional[SapNvarchar] = 0000
    # SAP HANA type: NVARCHAR | Forced nullable
    PDATL: Optional[SapNvarchar] = 0000
    # SAP HANA type: NVARCHAR | Forced nullable
    PDATV: Optional[SapNvarchar] = 0000
    # SAP HANA type: NVARCHAR | Forced nullable
    EKALR: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    VPLPR: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    MLMAA: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    MLAST: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    LPLPR: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    VKSAL: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    HKMAT: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SPERW: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KZIWL: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    WLINL: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    ABCIW: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    BWSPA: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    LPLPX: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    VPLPX: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    FPLPX: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    LBWST: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    VBWST: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FBWST: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    EKLAS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    QKLAS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    MTUSE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    MTORG: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    OWNPR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    XBEWM: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    BWPEI: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    MBRUE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    OKLAS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    DUMMY_VAL_INCL_EEW_PS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    OIPPINV: Optional[SapNvarchar] = ""

class Mdma(SapHanaBaseModel):
    """
    Model for SAP HANA table: MDMA
    Schema: SAPHANADB
    """

    # SAP HANA type: NVARCHAR | Primary key | Order by field
    MANDT: Key[SapNvarchar]
    # SAP HANA type: NVARCHAR | Primary key
    MATNR: Key[SapNvarchar]
    # SAP HANA type: NVARCHAR | Primary key
    BERID: Key[SapNvarchar]
    # SAP HANA type: NVARCHAR | Forced nullable
    WERKS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    DISPR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    DISMM: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    DISPO: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    DISGR: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    MINBE: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    LFRHY: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FXHOR: Optional[SapNvarchar] = 000
    # SAP HANA type: NVARCHAR | Forced nullable
    DISLS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    RDPRF: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    BSTRF: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    BSTMI: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    BSTMA: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    MABST: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    TAKZT: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    AUSSS: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    SOBSL: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    LGPRO: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    LGFSB: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    MRPPP: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    EISBE: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    RWPRO: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SHZET: Optional[SapNvarchar] = 00
    # SAP HANA type: DECIMAL | Forced nullable
    BSTFE: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    LOSFX: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    LAGPR: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    LGRAD: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    PROPR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    VRBMT: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    VRBDB: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    VRBDT: Optional[SapNvarchar] = 00000000
    # SAP HANA type: DECIMAL | Forced nullable
    VRBFK: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    LOEKZ: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SHPRO: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    AHDIS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    AUTRU: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PSTAT: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KZKFK: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SHFLG: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    APOKZ: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    PLIFZ: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    PLIFZX: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    AENAM: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    AEDAT: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    AEZEIT: Optional[SapNvarchar] = 000000
    # SAP HANA type: NVARCHAR | Forced nullable
    SFTY_STK_METH: Optional[SapNvarchar] = ""
    # SAP HANA type: VARBINARY | Nullable
    SCM_MATLOCID_GUID16: Optional[SapVarbinary] = 00000000000000000000000000000000
    # SAP HANA type: NVARCHAR | Forced nullable
    SCM_MATLOCID_GUID22: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    SCM_GRPRT: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    SCM_GIPRT: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    SCM_RRP_TYPE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SCM_HEUR_ID: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SCM_PACKAGE_ID: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    SCM_CONHAP: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    SCM_HUNIT: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    SCM_CONHAP_OUT: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    SCM_HUNIT_OUT: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SCM_RRP_SEL_GROUP: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SCM_LSUOM: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    SCM_REORD_DUR: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    SCM_TARGET_DUR: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    SCM_TSTRID: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Order by field
    SCM_THRUPUT_TIME: SapDecimal
    # SAP HANA type: NVARCHAR | Forced nullable
    SCM_TPOP: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    SCM_SAFTY_V: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    SCM_PPSAFTYSTK: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    SCM_PPSAFTYSTK_V: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    SCM_REPSAFTY: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    SCM_REPSAFTY_V: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    SCM_REORD_V: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    SCM_MAXSTOCK_V: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    SCM_SCOST_PRCNT: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    SCM_PROC_COST: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    SCM_NDCOSTWE: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    SCM_NDCOSTWA: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    SCM_CONINP: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    SCM_IUNIT: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    SCM_SCOST: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    SCM_SSPEN: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    MAXDOS_PEN: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    MAXDOS_FLG: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SAFTYSTOCK_METHOD: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    TARGET_STOCK_LEVEL_METH: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    AUTO_DET_SFTYSTK_METH: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    USE_PERIOD_FACTOR: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    PERIOD_FACTOR_VALUE: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    PERIOD_FACTOR_TDS: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    CONVH: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    SDM_VERSION: Optional[SapNvarchar] = ""

class Mkal(SapHanaBaseModel):
    """
    Model for SAP HANA table: MKAL
    Schema: SAPHANADB
    """

    # SAP HANA type: NVARCHAR | Primary key | Order by field
    MANDT: Key[SapNvarchar]
    # SAP HANA type: NVARCHAR | Primary key | Order by field
    MATNR: Key[SapNvarchar]
    # SAP HANA type: NVARCHAR | Primary key
    WERKS: Key[SapNvarchar]
    # SAP HANA type: NVARCHAR | Primary key
    VERID: Key[SapNvarchar]
    # SAP HANA type: NVARCHAR | Forced nullable
    BDATU: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    ADATU: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    STLAL: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    STLAN: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PLNTY: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PLNNR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ALNAL: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    BESKZ: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SOBSL: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    LOSGR: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    MDV01: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    MDV02: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    TEXT1: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    EWAHR: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    VERTO: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SERKZ: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    BSTMI: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    BSTMA: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    RGEKZ: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ALORT: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PLTYG: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PLNNG: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ALNAG: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PLTYM: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PLNNM: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ALNAM: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    CSPLT: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    MATKO: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ELPRO: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PRVBE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PRFG_F: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PRDAT: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    MKSP: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PRFG_R: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PRFG_G: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PRFG_S: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    UCMAT: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    VERSIND: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    DIFFPLANEXEMSTR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    EWM_LGNUM: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    EWM_LGPLA: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    EXE_STLAL: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    EXE_STLAN: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    EXE_PLNTY: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    EXE_PLNNR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    EXE_ALNAL: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    TSA_PRVBE: Optional[SapNvarchar] = ""
    # SAP HANA type: VARBINARY | Nullable
    PNGUID: Optional[SapVarbinary] = 00000000000000000000000000000000
    # SAP HANA type: NVARCHAR | Forced nullable
    DUMMY_MKAL_INCL_EEW_PS: Optional[SapNvarchar] = ""
    # SAP HANA type: VARBINARY | Nullable
    PPEGUID: Optional[SapVarbinary] = 00000000000000000000000000000000

class Mlan(SapHanaBaseModel):
    """
    Model for SAP HANA table: MLAN
    Schema: SAPHANADB
    """

    # SAP HANA type: NVARCHAR | Primary key | Order by field
    MANDT: Key[SapNvarchar]
    # SAP HANA type: NVARCHAR | Primary key | Order by field
    MATNR: Key[SapNvarchar]
    # SAP HANA type: NVARCHAR | Primary key
    ALAND: Key[SapNvarchar]
    # SAP HANA type: NVARCHAR | Forced nullable
    TAXM1: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    TAXM2: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    TAXM3: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    TAXM4: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    TAXM5: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    TAXM6: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    TAXM7: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    TAXM8: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    TAXM9: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    TAXIM: Optional[SapNvarchar] = ""

class Mvke(SapHanaBaseModel):
    """
    Model for SAP HANA table: MVKE
    Schema: SAPHANADB
    """

    # SAP HANA type: NVARCHAR | Primary key | Order by field
    MANDT: Key[SapNvarchar]
    # SAP HANA type: NVARCHAR | Primary key | Order by field
    MATNR: Key[SapNvarchar]
    # SAP HANA type: NVARCHAR | Primary key
    VKORG: Key[SapNvarchar]
    # SAP HANA type: NVARCHAR | Primary key
    VTWEG: Key[SapNvarchar]
    # SAP HANA type: NVARCHAR | Forced nullable
    LVORM: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    VERSG: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    BONUS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PROVG: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SKTOF: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    VMSTA: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    VMSTD: Optional[SapNvarchar] = 00000000
    # SAP HANA type: DECIMAL | Forced nullable
    AUMNG: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    LFMNG: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    EFMNG: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    SCMNG: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    SCHME: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    VRKME: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    MTPOS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    DWERK: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PRODH: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PMATN: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KONDM: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KTGRM: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    MVGR1: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    MVGR2: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    MVGR3: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    MVGR4: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    MVGR5: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    IS_ENTLMNT_RLVT: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SSTUF: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PFLKS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    LSTFL: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    LSTVZ: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    LSTAK: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    LDVFL: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    LDBFL: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    LDVZL: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    LDBZL: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    VDVFL: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    VDBFL: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    VDVZL: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    VDBZL: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    PRAT1: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PRAT2: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PRAT3: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PRAT4: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PRAT5: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PRAT6: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PRAT7: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PRAT8: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PRAT9: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PRATA: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    RDPRF: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    MEGRU: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    LFMAX: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    RJART: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PBIND: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    VAVME: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    MATKC: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PVMSO: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    DUMMY_SALD_INCL_EEW_PS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    BEV1_EMLGRP: Optional[SapNvarchar] = Field(alias="/BEV1/EMLGRP", default="")
    # SAP HANA type: NVARCHAR | Forced nullable
    BEV1_EMDRCKSPL: Optional[SapNvarchar] = Field(alias="/BEV1/EMDRCKSPL", default=0)
    # SAP HANA type: NVARCHAR | Forced nullable
    BEV1_RPBEZME: Optional[SapNvarchar] = Field(alias="/BEV1/RPBEZME", default="")
    # SAP HANA type: NVARCHAR | Forced nullable
    BEV1_RPSNS: Optional[SapNvarchar] = Field(alias="/BEV1/RPSNS", default="")
    # SAP HANA type: NVARCHAR | Forced nullable
    BEV1_RPSFA: Optional[SapNvarchar] = Field(alias="/BEV1/RPSFA", default="")
    # SAP HANA type: NVARCHAR | Forced nullable
    BEV1_RPSKI: Optional[SapNvarchar] = Field(alias="/BEV1/RPSKI", default="")
    # SAP HANA type: NVARCHAR | Forced nullable
    BEV1_RPSCO: Optional[SapNvarchar] = Field(alias="/BEV1/RPSCO", default="")
    # SAP HANA type: NVARCHAR | Forced nullable
    BEV1_RPSSO: Optional[SapNvarchar] = Field(alias="/BEV1/RPSSO", default="")
    # SAP HANA type: NVARCHAR | Forced nullable
    NF_FLAG: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    CTR_TERM_DEF: Optional[SapNvarchar] = 000
    # SAP HANA type: NVARCHAR | Forced nullable
    CTR_TERM_ALT1: Optional[SapNvarchar] = 000
    # SAP HANA type: NVARCHAR | Forced nullable
    CTR_TERM_ALT2: Optional[SapNvarchar] = 000
    # SAP HANA type: NVARCHAR | Forced nullable
    CTR_TERM_UNIT: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    EXT_PERIOD_DEF: Optional[SapNvarchar] = 000
    # SAP HANA type: NVARCHAR | Forced nullable
    EXT_PERIOD_ALT1: Optional[SapNvarchar] = 000
    # SAP HANA type: NVARCHAR | Forced nullable
    EXT_PERIOD_ALT2: Optional[SapNvarchar] = 000
    # SAP HANA type: NVARCHAR | Forced nullable
    EXT_PERIOD_UNIT: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PACKAGE_TYPE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PACKAGE_SIZE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PLGTP: Optional[SapNvarchar] = ""

class Pkhd(SapHanaBaseModel):
    """
    Model for SAP HANA table: PKHD
    Schema: SAPHANADB
    """

    # SAP HANA type: NVARCHAR | Primary key | Order by field
    MANDT: Key[SapNvarchar]
    # SAP HANA type: NVARCHAR | Primary key
    PKNUM: Key[SapNvarchar]
    # SAP HANA type: NVARCHAR | Forced nullable
    MATNR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    WERKS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PRVBE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    BEHAZ: Optional[SapNvarchar] = 000
    # SAP HANA type: DECIMAL | Forced nullable
    BEHMG: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    VERID: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SIGAZ: Optional[SapNvarchar] = 000
    # SAP HANA type: NVARCHAR | Forced nullable
    RGVER: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PKOSA: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PKSTE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    BERKZ: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    LGNUM: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    LGTYP: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    LGPLA: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    NKDYN: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PKSTF: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PKSTU: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    LIFNR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    EKORG: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    EBELN: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    EBELP: Optional[SapNvarchar] = 00000
    # SAP HANA type: NVARCHAR | Forced nullable
    ANSWB: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PKBHT: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    QUFKT: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    UMLGO: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    MEINS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    RKSTA: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KOSTL: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    VBPRN: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    VBQUE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    CC_PRINT_QUEUE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PKDRS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PKUMW: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PKADR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PKSFG: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PKLOG: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    ALSMG: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    ABLAD: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KCART: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    KCSAF: Optional[SapDecimal] = 0
    # SAP HANA type: SMALLINT | Forced nullable
    KCCON: Optional[SapSmallInt] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    PKRMG: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    PKFMG: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    KCPRF: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    KWBZD: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    KWBZM: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    VBELN: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    VBELP: Optional[SapNvarchar] = 000000
    # SAP HANA type: NVARCHAR | Forced nullable
    QUPVB: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PABPRF: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PACKV: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ANZLT: Optional[SapNvarchar] = 000
    # SAP HANA type: NVARCHAR | Forced nullable
    RKFORM: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KBFORM: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    CC_PRINT_FORM: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ZPUNKT: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    LCM_STATUS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    CRE_DATE: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    RLS_DATE: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Order by field
    RELEASE_TIME: SapNvarchar
    # SAP HANA type: NVARCHAR | Forced nullable
    OBS_DATE: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Order by field
    LOCK_TIME: SapNvarchar
    # SAP HANA type: DECIMAL | Forced nullable
    LASTCHANGE_DATETIME: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    LASTCHANGE_USER: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    PINTVD: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    JIT_ACTION_CONTROL: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PARTIAL_GR_ALLOWED_IND: Optional[SapNvarchar] = ""
    # SAP HANA type: INTEGER | Forced nullable
    MAX_NUMBER_OPEN_CALLS: Optional[SapInteger] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    REPL_QTY_LOWER_TOLERANCE_LVL: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    SUPL_QTY_UPPER_TOLERANCE_LVL: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    SUPL_QTY_LOWER_TOLERANCE_LVL: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    JIT_STCK_TRANSFER_REPL_STRAT: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    JIT_EXT_PROC_REPL_STRAT: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    COMMUNICATION_GROUP: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    OFFSET_FROM_START_OF_PRODN: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    DUMMY_NJIT_CCYC_INCL_EEW_PS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    DUMMY_KANBAN_CCYC_INCL_EEW_PS: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    PINTVM: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    KNFZD: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    KNFZM: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    KWTZD: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    KWTZM: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    KITZD: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    KITZM: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    KDMBUF: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    KSPBUF: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    NTREL: Optional[SapNvarchar] = 000
    # SAP HANA type: NVARCHAR | Forced nullable
    TRIGAZ: Optional[SapNvarchar] = 000
    # SAP HANA type: NVARCHAR | Forced nullable
    TRIGGR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    CAPA_WRKCT: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    NLPLA: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    VLPLA: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PRCTY: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FAZUS: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    SAFETY_TIME_IN_DAYS: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    SAFETY_TIME_IN_MINUTES: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    PLNG_PROCEDURE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SUMRST2: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SUMRST3: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    PLNG_HORIZON: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    MIN_STOCK: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    LOT_SIZING_PROC: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SCHEDULING_TYPE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SEQRST2: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    JITSCPRF: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    JITOTOL: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    LGNUM_EWM: Optional[SapNvarchar] = ""

class Plaf(SapHanaBaseModel):
    """
    Model for SAP HANA table: PLAF
    Schema: SAPHANADB
    """

    # SAP HANA type: NVARCHAR | Primary key | Order by field
    MANDT: Key[SapNvarchar]
    # SAP HANA type: NVARCHAR | Primary key
    PLNUM: Key[SapNvarchar]
    # SAP HANA type: NVARCHAR | Forced nullable
    MATNR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PLWRK: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PWWRK: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PAART: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    BESKZ: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SOBES: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    GSMNG: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    TLMNG: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    AVMNG: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    BDMNG: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    PSTTR: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    PEDTR: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    PERTR: Optional[SapNvarchar] = 00000000
    # SAP HANA type: DECIMAL | Forced nullable
    WEBAZ: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    DISPO: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    UMSKZ: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    AUFFX: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    STLFX: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KNTTP: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KDAUF: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KDPOS: Optional[SapNvarchar] = 000000
    # SAP HANA type: NVARCHAR | Forced nullable
    KDEIN: Optional[SapNvarchar] = 0000
    # SAP HANA type: NVARCHAR | Forced nullable
    PROJN: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    RSNUM: Optional[SapNvarchar] = 0000000000
    # SAP HANA type: NVARCHAR | Forced nullable
    QUNUM: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    QUPOS: Optional[SapNvarchar] = 000
    # SAP HANA type: NVARCHAR | Forced nullable
    FLIEF: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KONNR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KTPNR: Optional[SapNvarchar] = 00000
    # SAP HANA type: NVARCHAR | Forced nullable
    EKORG: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    LGORT: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    NUMVR: Optional[SapNvarchar] = 00
    # SAP HANA type: NVARCHAR | Forced nullable
    KZVBR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SOBKZ: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PSPEL: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    SERNR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PALTR: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    TECHS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    STLAN: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    STALT: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    STSTA: Optional[SapNvarchar] = 00
    # SAP HANA type: NVARCHAR | Forced nullable
    AENNR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ARSNR: Optional[SapNvarchar] = 0000000000
    # SAP HANA type: NVARCHAR | Forced nullable
    ARSPS: Optional[SapNvarchar] = 0000
    # SAP HANA type: NVARCHAR | Forced nullable
    VERTO: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    VERID: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    AUFNR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    TRART: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PLGRP: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    TERST: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    TERED: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    BEDID: Optional[SapNvarchar] = 000000000000
    # SAP HANA type: NVARCHAR | Forced nullable
    AUFPL: Optional[SapNvarchar] = 0000000000
    # SAP HANA type: NVARCHAR | Forced nullable
    LINID: Optional[SapNvarchar] = 000000000000000
    # SAP HANA type: NVARCHAR | Forced nullable
    TRMKZ: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    TRMER: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    REDKZ: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    TRMHK: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PLNNR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PLNAL: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PLNTY: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FRTHW: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    RGEKZ: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    MEINS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    CUOBJ: Optional[SapNvarchar] = 000000000000000000
    # SAP HANA type: NVARCHAR | Forced nullable
    REVLV: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    ABMNG: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    RATID: Optional[SapNvarchar] = 000000000000
    # SAP HANA type: NVARCHAR | Forced nullable
    GROID: Optional[SapNvarchar] = 000000000000
    # SAP HANA type: NVARCHAR | Forced nullable
    RATER: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    GROER: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    OBART: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PLSCN: Optional[SapNvarchar] = 000
    # SAP HANA type: NVARCHAR | Forced nullable
    SBNUM: Optional[SapNvarchar] = 0000000000
    # SAP HANA type: NVARCHAR | Forced nullable
    KBNKZ: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KAPFX: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SEQNR: Optional[SapNvarchar] = 00000000000000
    # SAP HANA type: NVARCHAR | Forced nullable
    PSTTI: Optional[SapNvarchar] = 000000
    # SAP HANA type: NVARCHAR | Forced nullable
    PEDTI: Optional[SapNvarchar] = 000000
    # SAP HANA type: NVARCHAR | Forced nullable
    MONKZ: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PRNKZ: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    MDPBV: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    VFMNG: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    MDACH: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    MDACC: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    MDACD: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    MDACT: Optional[SapNvarchar] = 000000
    # SAP HANA type: NVARCHAR | Forced nullable
    GSBTR: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    PLETX: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PRSCH: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    LVSCH: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KZAVC: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    VRPLA: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PBDNR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    AGREQ: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    UMREZ: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    UMREN: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    ERFMG: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    ERFME: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    RQNUM: Optional[SapNvarchar] = 0000000000
    # SAP HANA type: NVARCHAR | Forced nullable
    KZBWS: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    WEMNG: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    WAMNG: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    EDGNO: Optional[SapNvarchar] = 00000000000000000
    # SAP HANA type: NVARCHAR | Forced nullable
    LBLKZ: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    EMLIF: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    BERID: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    UBERI: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    EMATN: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    REMFL: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    PSTMP: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    PUSER: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    BADI: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    STAEX: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    RESLO: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SRM_CONTRACT_ID: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SRM_CONTRACT_ITM: Optional[SapNvarchar] = 0000000000
    # SAP HANA type: NVARCHAR | Forced nullable
    ORG_REQ_DATE: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    PTEXT: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    DUMMY_PLAF_INCL_EEW_PS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    MEDKZ: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    CNFQTY: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    SGT_SCAT: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    PLIFZ: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    BOM_VERSN: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    DAC_PP_COMPONENT: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    DAC_INDIRECT_ACCESS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    DAC_CREATION_DATE: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    M_MRP: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KUNNR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FLG_BUNDLE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FSH_MPLND_ORD: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FSH_SEASON_YEAR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FSH_SEASON: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FSH_COLLECTION: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FSH_THEME: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ATRKZ: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Order by field
    DPS_HANDOVER_TIME: SapDecimal

class Plko(SapHanaBaseModel):
    """
    Model for SAP HANA table: PLKO
    Schema: SAPHANADB
    """

    # SAP HANA type: NVARCHAR | Primary key | Order by field
    MANDT: Key[SapNvarchar]
    # SAP HANA type: NVARCHAR | Primary key
    PLNTY: Key[SapNvarchar]
    # SAP HANA type: NVARCHAR | Primary key
    PLNNR: Key[SapNvarchar]
    # SAP HANA type: NVARCHAR | Primary key
    PLNAL: Key[SapNvarchar]
    # SAP HANA type: NVARCHAR | Primary key
    ZAEHL: Key[SapNvarchar]
    # SAP HANA type: NVARCHAR | Forced nullable
    DATUV: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    TECHV: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    AENNR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    LOEKZ: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PARKZ: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ANDAT: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    ANNAM: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    AEDAT: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    AENAM: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    VERWE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    WERKS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    STATU: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PLNME: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    LOSVN: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    LOSBS: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    VAGRP: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    AESZN: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KTEXT: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    TXTSP: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ABDAT: Optional[SapNvarchar] = 00000000
    # SAP HANA type: DECIMAL | Forced nullable
    ABANZ: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    PROFIDNETZ: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KOKRS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    QVEWERKS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    QVEMENGE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    QVEVERSION: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    QVEDATUM: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    QVEGRUPPE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    QVECODE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    QDYNREGEL: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    QDYNHEAD: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    QPRZIEHVER: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    QVERSNPRZV: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    QKZRASTER: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    QDYNSTRING: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    STRAT: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PPOOL: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ISTRU: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    IWERK: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ANLZU: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ARBID: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    EXTNUM: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    DELKZ: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ARBTY: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    STUPR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    CLNDR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PRTYP: Optional[SapNvarchar] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    REODAT: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    NETID: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    FLG_CHK: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PSPNR: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    TTRAS: Optional[SapNvarchar] = 000000
    # SAP HANA type: NVARCHAR | Forced nullable
    KZKFG: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PLNNR_ALT: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FLG_CAPO: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    STLTY: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    STLNR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    STLAL: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SLWBEZ: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PPKZTLZU: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    CHRULE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    CCOAA: Optional[SapNvarchar] = 000
    # SAP HANA type: NVARCHAR | Forced nullable
    ST_ARBID: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    MEINH: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    UMREZ: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    UMREN: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    BMSCH: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    ADPSP: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    VALID_TO: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    LOEKZ_INHERITED: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    DUMMY_PLKO_INCL_EEW_PS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    MS_FLAG: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Order by field
    CHANGEDDATETIME: SapDecimal
    # SAP HANA type: DECIMAL | Forced nullable
    TSTMP_BW: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    MES_ROUTINGID: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    VERSN: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    CRTYPE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    EFFTYP: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    XHIERTL: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    TL_EXTID: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    AXON_DURATION: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    AXON_C1: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    AXON_UNIT: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    AXON_TLGROUP: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    AXON_GROUPCNTR: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    AXON_NONROUT: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    AXON_TLGROUP2: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    AXON_GROUPCNTR2: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    AXON_DEFECTTL: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    TBX_ATTRIBUTES: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    TASKLIST_VERSIONED: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    DEPENDENT_TASKLIST: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    CURRENT_DOCNO: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    CURRENT_DOCTYP: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    CURRENT_DOCVR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    CURRENT_DOCTL: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    LINKED_TL_TYPE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    LNKED_TL_MROTYPE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    LINKED_TL_VERSION: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    LINKED_TL_COUNTER: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    LINKED_TL_GRPCOUNT: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    OBJNR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PROCESSED: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PROCESSED_DL: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ZZEVENT_CODE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ZZRESET_FLAG: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ZZPEST_FLAG: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ZZDOC_CREATION: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ZZATNAM: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ZZKATALOGART: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ZZCODEGRUPPE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ZZCODE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ZZPEST_USAGE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ZZPEST_DURATION: Optional[SapNvarchar] = 000

class Plmk(SapHanaBaseModel):
    """
    Model for SAP HANA table: PLMK
    Schema: SAPHANADB
    """

    # SAP HANA type: NVARCHAR | Primary key | Order by field
    MANDT: Key[SapNvarchar]
    # SAP HANA type: NVARCHAR | Primary key | Order by field
    PLNTY: Key[SapNvarchar]
    # SAP HANA type: NVARCHAR | Primary key
    PLNNR: Key[SapNvarchar]
    # SAP HANA type: NVARCHAR | Primary key
    PLNKN: Key[SapNvarchar]
    # SAP HANA type: NVARCHAR | Primary key
    KZEINSTELL: Key[SapNvarchar]
    # SAP HANA type: NVARCHAR | Primary key
    MERKNR: Key[SapNvarchar]
    # SAP HANA type: NVARCHAR | Primary key
    ZAEHL: Key[SapNvarchar]
    # SAP HANA type: NVARCHAR | Forced nullable
    GUELTIGAB: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    SERNV: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    LOEKZ: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PARKZ: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    AENDERGNR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ERSTELLER: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ERSTELLDAT: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    AENDERER: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    AENDERDAT: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    STEUERKZ: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    QMTB_WERKS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PMETHODE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PMTVERSION: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    QPMK_REF: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    QPMK_ZAEHL: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    VERWMERKM: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    MKVERSION: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    MKVERSDAT: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    MERKGEW: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PROBENR: Optional[SapNvarchar] = 000
    # SAP HANA type: NVARCHAR | Forced nullable
    PRUEFQUALI: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    TOLERANZSL: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KURZTEXT: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    LTEXTKZ: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    LTEXTSPR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    LTEXTEKZ: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    LTXTENTSPR: Optional[SapNvarchar] = ""
    # SAP HANA type: SMALLINT | Forced nullable
    STELLEN: Optional[SapSmallInt] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    MASSEINHSW: Optional[SapNvarchar] = ""
    # SAP HANA type: DOUBLE | Forced nullable
    SOLLWERT: Optional[SapDouble] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    SOLLWNI: Optional[SapNvarchar] = ""
    # SAP HANA type: DOUBLE | Forced nullable
    TOLERANZOB: Optional[SapDouble] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    TOLOBNI: Optional[SapNvarchar] = ""
    # SAP HANA type: DOUBLE | Forced nullable
    TOLERANZUN: Optional[SapDouble] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    TOLUNNI: Optional[SapNvarchar] = ""
    # SAP HANA type: SMALLINT | Forced nullable
    KLASANZAHL: Optional[SapSmallInt] = 0
    # SAP HANA type: DOUBLE | Forced nullable
    KLASBREITE: Optional[SapDouble] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    KLASBRNI: Optional[SapNvarchar] = ""
    # SAP HANA type: DOUBLE | Forced nullable
    KLASMITTE: Optional[SapDouble] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    KLASMINI: Optional[SapNvarchar] = ""
    # SAP HANA type: DOUBLE | Forced nullable
    GRENZEOB1: Optional[SapDouble] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    GRENZOB1NI: Optional[SapNvarchar] = ""
    # SAP HANA type: DOUBLE | Forced nullable
    GRENZEUN1: Optional[SapDouble] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    GRENZUN1NI: Optional[SapNvarchar] = ""
    # SAP HANA type: DOUBLE | Forced nullable
    GRENZEOB2: Optional[SapDouble] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    GRENZOB2NI: Optional[SapNvarchar] = ""
    # SAP HANA type: DOUBLE | Forced nullable
    GRENZEUN2: Optional[SapDouble] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    GRENZUN2NI: Optional[SapNvarchar] = ""
    # SAP HANA type: DOUBLE | Forced nullable
    PLAUSIOBEN: Optional[SapDouble] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    PLAUSIOBNI: Optional[SapNvarchar] = ""
    # SAP HANA type: DOUBLE | Forced nullable
    PLAUSIUNTE: Optional[SapDouble] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    PLAUSIUNNI: Optional[SapNvarchar] = ""
    # SAP HANA type: DOUBLE | Forced nullable
    TOLERWEIOB: Optional[SapDouble] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    TOLWOBNI: Optional[SapNvarchar] = ""
    # SAP HANA type: DOUBLE | Forced nullable
    TOLERWEIUN: Optional[SapDouble] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    TOLWUNNI: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    TOLERWAB: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    TOLERWBIS: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    STICHPRVER: Optional[SapNvarchar] = ""
    # SAP HANA type: DOUBLE | Forced nullable
    FAKPLANME: Optional[SapDouble] = 0
    # SAP HANA type: DOUBLE | Forced nullable
    FAKPROBME: Optional[SapDouble] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    PROBEMGEH: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    PRUEFEINH: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    DYNKRIT: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FORMELSL: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FORMEL1: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FORMEL2: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    CODEGR9U: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    CODE9U: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    CODEVR9U: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    CODEGR9O: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    CODE9O: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    CODEVR9O: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KATAB1: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KATALGART1: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    AUSWMENGE1: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    AUSWMGWRK1: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    AUSWVERS1: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    AUSWDAT1: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    KATAB2: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KATALGART2: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    AUSWMENGE2: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    AUSWMGWRK2: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    AUSWVERS2: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    AUSWDAT2: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    KATAB3: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KATALGART3: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    AUSWMENGE3: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    AUSWMGWRK3: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    AUSWVERS3: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    AUSWDAT3: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    KATAB4: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KATALGART4: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    AUSWMENGE4: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    AUSWMGWRK4: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    AUSWVERS4: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    AUSWDAT4: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    KATAB5: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KATALGART5: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    AUSWMENGE5: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    AUSWMGWRK5: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    AUSWVERS5: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    AUSWDAT5: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    DUMMY10: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    DUMMY20: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    DUMMY40: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    CHARACT_ID1: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    QERGDATH: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    EEANTVERF: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    QDYNREGEL: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    DYNMERKREF: Optional[SapNvarchar] = 0000
    # SAP HANA type: NVARCHAR | Forced nullable
    PZLFH: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    CODEGRQUAL: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    CODEQUAL: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SPCKRIT: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    INPPROC: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    RES_PLAN: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    CTRMETH: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    CHAORIG: Optional[SapNvarchar] = ""
    # SAP HANA type: VARBINARY | Nullable
    CHAORIG_GUID: Optional[SapVarbinary] = 00000000000000000000000000000000
    # SAP HANA type: NVARCHAR | Forced nullable
    NO_INSPECTION: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    QP_CHAORIG_ID: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    CHARGROUP: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    CHARGROUP_CREF: Optional[SapNvarchar] = 0000
    # SAP HANA type: NVARCHAR | Forced nullable
    DIVISIONINT: Optional[SapNvarchar] = 0000
    # SAP HANA type: NVARCHAR | Forced nullable
    VALID_TO_ON_DB: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    VERSN: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    VERSN_SOURCE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    VERSN_SOURCE_PLNKN: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    VERSN_SOURCE_MERKNR: Optional[SapNvarchar] = 0000
    # SAP HANA type: NVARCHAR | Forced nullable
    DUMMY_PLMK_INCL_EEW_PS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    CHAR_RELEVANCE: Optional[SapNvarchar] = ""

class Plmz(SapHanaBaseModel):
    """
    Model for SAP HANA table: PLMZ
    Schema: SAPHANADB
    """

    # SAP HANA type: NVARCHAR | Primary key | Order by field
    MANDT: Key[SapNvarchar]
    # SAP HANA type: NVARCHAR | Primary key | Order by field
    PLNTY: Key[SapNvarchar]
    # SAP HANA type: NVARCHAR | Primary key
    PLNNR: Key[SapNvarchar]
    # SAP HANA type: NVARCHAR | Primary key
    ZUONR: Key[SapNvarchar]
    # SAP HANA type: NVARCHAR | Primary key
    ZAEHL: Key[SapNvarchar]
    # SAP HANA type: NVARCHAR | Forced nullable
    DATUV: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    TECHV: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    AENNR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    LOEKZ: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PARKZ: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PLNAL: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PLNFL: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PLNKN: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    STLTY: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    STLNR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    STLAL: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    STLKN: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    WERK_STL: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ZUDIV: Optional[SapNvarchar] = 00000
    # SAP HANA type: DECIMAL | Forced nullable
    ZUMS1: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    ZUMS2: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    ZUMS3: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    ZUMEI: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    IMENG: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    IMEIN: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ANDAT: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    ANNAM: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    AEDAT: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    AENAM: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    RGEKZ: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    STLST: Optional[SapNvarchar] = 00
    # SAP HANA type: NVARCHAR | Forced nullable
    STLWG: Optional[SapNvarchar] = 00
    # SAP HANA type: NVARCHAR | Forced nullable
    REFKN: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    GP_MATNR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    GP_WERKS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    GP_UVORN: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    GP_KRIT1: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    GP_FREET: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    AOBAR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ZEINH: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    DAUER: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    DMENG: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    KNTTP: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FLGEX: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    VORAB: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    STRECKE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    STLTY_W: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    STLNR_W: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    STLAL_W: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KANTE: Optional[SapNvarchar] = 000000
    # SAP HANA type: NVARCHAR | Forced nullable
    LGORT: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    DISP: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PRODFLOWID: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    BEIKZ: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ABLAD: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    WEMPF: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    VALID_TO: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    LOEKZ_INHERITED: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    VERSN: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    VERSN_SOURCE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    VERSN_SOURCE_ZUONR: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    BOM_VERSN: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    BOM_VERSN_W: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    LOG_COMP: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    SERVICEDURATION: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    SERVICEDURATIONUNIT: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    OVERALLLIMITAMOUNT: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    EXPCTEDOVERALLLIMITAMOUNT: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    RECIPIENTLOCATIONCODE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PRODUCTTYPE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    CURRENCY: Optional[SapNvarchar] = ""

class Plpo(SapHanaBaseModel):
    """
    Model for SAP HANA table: PLPO
    Schema: SAPHANADB
    """

    # SAP HANA type: NVARCHAR | Primary key | Order by field
    MANDT: Key[SapNvarchar]
    # SAP HANA type: NVARCHAR | Primary key | Order by field
    PLNTY: Key[SapNvarchar]
    # SAP HANA type: NVARCHAR | Primary key
    PLNNR: Key[SapNvarchar]
    # SAP HANA type: NVARCHAR | Primary key
    PLNKN: Key[SapNvarchar]
    # SAP HANA type: NVARCHAR | Primary key
    ZAEHL: Key[SapNvarchar]
    # SAP HANA type: NVARCHAR | Forced nullable
    DATUV: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    TECHV: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    AENNR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    LOEKZ: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PARKZ: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ANDAT: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    ANNAM: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    AEDAT: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    AENAM: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SUMNR: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    VORNR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    STEUS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ARBID: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    OBJTY: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    WERKS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KTSCH: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    LTXA1: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    LTXA2: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    TXTSP: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    VPLTY: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    VPLNR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    VPLAL: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    VPLFL: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    VINTV: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    MEINH: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    UMREN: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    UMREZ: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    BMSCH: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    ZMERH: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    ZEIER: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    LAR01: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    VGE01: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    VGW01: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    LAR02: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    VGE02: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    VGW02: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    LAR03: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    VGE03: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    VGW03: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    LAR04: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    VGE04: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    VGW04: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    LAR05: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    VGE05: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    VGW05: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    LAR06: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    VGE06: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    VGW06: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    ZERMA: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ZGDAT: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ZCODE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ZULNR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    RSANZ: Optional[SapNvarchar] = 000
    # SAP HANA type: NVARCHAR | Forced nullable
    PDEST: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    LOANZ: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    LOART: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    QUALF: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    ANZMA: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    RFGRP: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    RFSCH: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    RASCH: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    AUFAK: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    LOGRP: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    UEMUS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    UEKAN: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FLIES: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ZEIMU: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    ZMINU: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    MINWE: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    SPMUS: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    SPLIM: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    ZEIMB: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    ZMINB: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    ZEILM: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    ZLMAX: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    ZEILP: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    ZLPRO: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    ZEIWN: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    ZWNOR: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    ZEIWM: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    ZWMIN: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    ZEITN: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    ZTNOR: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    ZEITM: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    ZTMIN: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    ABLIPKZ: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    RSTRA: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    BZOFFB: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    OFFSTB: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    EHOFFB: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    BZOFFE: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    OFFSTE: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    EHOFFE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SORTL: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    LIFNR: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    PLIFZ: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    PREIS: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    PEINH: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    SAKTO: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    WAERS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    INFNR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ESOKZ: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    EKORG: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    EKGRP: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KZLGF: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    MATKL: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    DAUNO: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    DAUNE: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    DAUMI: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    DAUME: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    DDEHN: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    EINSA: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    EINSE: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    ARBEI: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    ARBEH: Optional[SapNvarchar] = ""
    # SAP HANA type: SMALLINT | Forced nullable
    ANZZL: Optional[SapSmallInt] = 0
    # SAP HANA type: SMALLINT | Forced nullable
    PRZNT: Optional[SapSmallInt] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    VERTL: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    MLSTN: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PPRIO: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    BUKRS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SLWID: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    USR00: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    USR01: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    USR02: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    USR03: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    USR04: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    USE04: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    USR05: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    USE05: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    USR06: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    USE06: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    USR07: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    USE07: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    USR08: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    USR09: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    USR10: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    USR11: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ANFKO: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ANFKOKRS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KAPAR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    INDET: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    LARNT: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    PRKST: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    QRASTERMNG: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    QRASTEREH: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ANLZU: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ISTRU: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ISTTY: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ISTNR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ISTKN: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    ISTPO: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    IUPOZ: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    EBORT: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KALID: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FRSP: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    VERTN: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ZGR01: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ZGR02: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ZGR03: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ZGR04: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ZGR05: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ZGR06: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    MDLID: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    RUZUS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    BMEIH: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    BMVRG: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    CKSELKZ: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KALKZ: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    NPRIO: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PVZKN: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    PHFLG: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PHSEQ: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KNOBJ: Optional[SapNvarchar] = 000000000000000000
    # SAP HANA type: NVARCHAR | Forced nullable
    ERFSICHT: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PSPNR: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    QLOTYPE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    QLOBJEKTID: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    QLKAPAR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    QKZPRZEIT: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    QKZZTMG1: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    QKZPRMENG: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    QKZPRFREI: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    QRASTZEHT: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    QRASTZFAK: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    QRASTMENG: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    QPPKTABS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KRIT1: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    CLASSID: Optional[SapNvarchar] = 0000000000
    # SAP HANA type: NVARCHAR | Forced nullable
    PACKNO: Optional[SapNvarchar] = 0000000000
    # SAP HANA type: NVARCHAR | Forced nullable
    EBELN: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    EBELP: Optional[SapNvarchar] = 00000
    # SAP HANA type: NVARCHAR | Forced nullable
    CAPOC: Optional[SapNvarchar] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    FLG_CAPTXT: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    CN_WEIGHT: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    QKZTLSBEST: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    AUFKT: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    DAFKT: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    RWFAK: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    AAUFG: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    VERDART: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    UAVO_AUFL: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FRDLB: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    QPART: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PRZ01: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    TAKT: Optional[SapNvarchar] = 0000
    # SAP HANA type: NVARCHAR | Forced nullable
    OPRID: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    NVADD: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    EVGEW: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    RFPNT: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FLG_TSK_GROUP: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ADPSP: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    VALID_TO: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    LOEKZ_INHERITED: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    DUMMY_PLPO_INCL_EEW_PS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    TPLNR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    EQUNR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    MES_OPERID: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    MES_STEPID: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    MANU_PROC: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    VERSN: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    VERSN_SOURCE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    VERSN_SOURCE_PLNKN: Optional[SapNvarchar] = 00000000
    # SAP HANA type: VARBINARY | Nullable
    VERSN_TRACK_GUID: Optional[SapVarbinary] = 00000000000000000000000000000000
    # SAP HANA type: NVARCHAR | Forced nullable
    FAV_GUID: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FAV_VERSN: Optional[SapNvarchar] = 0000000000
    # SAP HANA type: NVARCHAR | Forced nullable
    FAV_GUID_OLD: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FAV_VERSN_OLD: Optional[SapNvarchar] = 0000000000
    # SAP HANA type: NVARCHAR | Forced nullable
    CL_TYPE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    EXECUTION_STAGE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SAPMP_MET_LRCH: Optional[SapNvarchar] = Field(alias="/SAPMP/MET_LRCH", default="")
    # SAP HANA type: DECIMAL | Forced nullable
    SAPMP_MAX_FERTL: Optional[SapDecimal] = Field(alias="/SAPMP/MAX_FERTL", default=0)
    # SAP HANA type: DECIMAL | Forced nullable
    SAPMP_FIX_AS_J: Optional[SapDecimal] = Field(alias="/SAPMP/FIX_AS_J", default=0)
    # SAP HANA type: DECIMAL | Forced nullable
    SAPMP_FIX_AS_E: Optional[SapDecimal] = Field(alias="/SAPMP/FIX_AS_E", default=0)
    # SAP HANA type: DECIMAL | Forced nullable
    SAPMP_FIX_AS_L: Optional[SapDecimal] = Field(alias="/SAPMP/FIX_AS_L", default=0)
    # SAP HANA type: NVARCHAR | Forced nullable
    SAPMP_ABL_ZAHL: Optional[SapNvarchar] = Field(alias="/SAPMP/ABL_ZAHL", default=000000)
    # SAP HANA type: NVARCHAR | Forced nullable
    SUBPLNAL: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SUBPLNNR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SUBPLNTY: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    XEXCLTL: Optional[SapNvarchar] = ""

class Qmat(SapHanaBaseModel):
    """
    Model for SAP HANA table: QMAT
    Schema: SAPHANADB
    """

    # SAP HANA type: NVARCHAR | Primary key | Order by field
    MANDT: Key[SapNvarchar]
    # SAP HANA type: NVARCHAR | Primary key | Order by field
    ART: Key[SapNvarchar]
    # SAP HANA type: NVARCHAR | Primary key
    MATNR: Key[SapNvarchar]
    # SAP HANA type: NVARCHAR | Primary key
    WERKS: Key[SapNvarchar]
    # SAP HANA type: NVARCHAR | Forced nullable
    PPL: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SPEZUEBER: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    CONF: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    TLS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    APP: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    MER: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    INSMK: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    AVE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    STICHPRVER: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    DYNREGEL: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    SPROZ: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    HPZ: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    DYN: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    MPB: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    MST: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    EIN: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    MPDAU: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    CHG: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    QKZVERF: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    QPMAT: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    KZPRFKOST: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    AUFNR_CO: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    AKTIV: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    APA: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    AFR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    MMA: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FEH: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    PRFRQ: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    NKMPR: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    MS_FLAG: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    CHG_ORIG_17: Optional[SapNvarchar] = ""

class Stko(SapHanaBaseModel):
    """
    Model for SAP HANA table: STKO
    Schema: SAPHANADB
    """

    # SAP HANA type: NVARCHAR | Primary key | Order by field
    MANDT: Key[SapNvarchar]
    # SAP HANA type: NVARCHAR | Primary key
    STLTY: Key[SapNvarchar]
    # SAP HANA type: NVARCHAR | Primary key
    STLNR: Key[SapNvarchar]
    # SAP HANA type: NVARCHAR | Primary key
    STLAL: Key[SapNvarchar]
    # SAP HANA type: NVARCHAR | Primary key
    STKOZ: Key[SapNvarchar]
    # SAP HANA type: NVARCHAR | Forced nullable
    DATUV: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    TECHV: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    AENNR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    LKENZ: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    LOEKZ: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    VGKZL: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    ANDAT: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    ANNAM: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    AEDAT: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    AENAM: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    BMEIN: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    BMENG: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    CADKZ: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    LABOR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    LTXSP: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    STKTX: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    STLST: Optional[SapNvarchar] = 00
    # SAP HANA type: NVARCHAR | Forced nullable
    WRKAN: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    DVDAT: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    DVNAM: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    AEHLP: Optional[SapNvarchar] = 00
    # SAP HANA type: NVARCHAR | Forced nullable
    ALEKZ: Optional[SapNvarchar] = ""
    # SAP HANA type: VARBINARY | Nullable
    GUIDX: Optional[SapVarbinary] = 00000000000000000000000000000000
    # SAP HANA type: NVARCHAR | Forced nullable
    VALID_TO: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    ECN_TO: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    BOM_VERSN: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    VERSNST: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    VERSNLASTIND: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Order by field
    LASTCHANGEDATETIME: SapDecimal
    # SAP HANA type: NVARCHAR | Forced nullable
    BOM_AIN_IND: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    BOM_PREV_VERSN: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    DUMMY_STKO_INCL_EEW_PS: Optional[SapNvarchar] = ""

class Stpo(SapHanaBaseModel):
    """
    Model for SAP HANA table: STPO
    Schema: SAPHANADB
    """

    # SAP HANA type: NVARCHAR | Primary key | Order by field
    MANDT: Key[SapNvarchar]
    # SAP HANA type: NVARCHAR | Primary key
    STLTY: Key[SapNvarchar]
    # SAP HANA type: NVARCHAR | Primary key
    STLNR: Key[SapNvarchar]
    # SAP HANA type: NVARCHAR | Primary key
    STLKN: Key[SapNvarchar]
    # SAP HANA type: NVARCHAR | Primary key
    STPOZ: Key[SapNvarchar]
    # SAP HANA type: NVARCHAR | Forced nullable
    DATUV: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    TECHV: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    AENNR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    LKENZ: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    VGKNT: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    VGPZL: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    ANDAT: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    ANNAM: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    AEDAT: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    AENAM: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    IDNRK: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PSWRK: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    POSTP: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    POSNR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SORTF: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    MEINS: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    MENGE: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    FMENG: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    AUSCH: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    AVOAU: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    NETAU: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SCHGT: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    BEIKZ: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ERSKZ: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    RVREL: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SANFE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SANIN: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SANKA: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SANKO: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SANVS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    STKKZ: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    REKRI: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    REKRS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    CADPO: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    NFMAT: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    NLFZT: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    VERTI: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ALPOS: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    EWAHR: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    EKGRP: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    LIFZT: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    LIFNR: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    PREIS: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    PEINH: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    WAERS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SAKTO: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    ROANZ: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    ROMS1: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    ROMS2: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    ROMS3: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    ROMEI: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    ROMEN: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    RFORM: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    UPSKZ: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    VALKZ: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    LTXSP: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    POTX1: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    POTX2: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    OBJTY: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    MATKL: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    WEBAZ: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    DOKAR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    DOKNR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    DOKVR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    DOKTL: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    CSSTR: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    CLASS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KLART: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    POTPR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    AWAKZ: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    INSKZ: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    VCEKZ: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    VSTKZ: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    VACKZ: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    EKORG: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    CLOBK: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    CLMUL: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    CLALT: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    CVIEW: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KNOBJ: Optional[SapNvarchar] = 000000000000000000
    # SAP HANA type: NVARCHAR | Forced nullable
    LGORT: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KZKUP: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    INTRM: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    TPEKZ: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    STVKN: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    DVDAT: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    DVNAM: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    DSPST: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ALPST: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ALPRF: Optional[SapNvarchar] = 00
    # SAP HANA type: NVARCHAR | Forced nullable
    ALPGR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KZNFP: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    NFGRP: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    NFEAG: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KNDVB: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KNDBZ: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KSTTY: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KSTNR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KSTKN: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    KSTPZ: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    CLSZU: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    KZCLB: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    AEHLP: Optional[SapNvarchar] = 00
    # SAP HANA type: NVARCHAR | Forced nullable
    PRVBE: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    NLFZV: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    NLFMV: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    IDPOS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    IDHIS: Optional[SapNvarchar] = 00000
    # SAP HANA type: NVARCHAR | Forced nullable
    IDVAR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ALEKZ: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ITMID: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    GUID: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ITSOB: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    RFPNT: Optional[SapNvarchar] = ""
    # SAP HANA type: VARBINARY | Nullable
    GUIDX: Optional[SapVarbinary] = 00000000000000000000000000000000
    # SAP HANA type: NVARCHAR | Forced nullable
    SGT_CMKZ: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SGT_CATV: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    VALID_TO: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    VALID_TO_RKEY: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    ECN_TO: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ECN_TO_RKEY: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ABLAD: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    WEMPF: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    STVKN_VERSN: Optional[SapNvarchar] = 00000000
    # SAP HANA type: DECIMAL | Order by field
    LASTCHANGEDATETIME: SapDecimal
    # SAP HANA type: NVARCHAR | Forced nullable
    PRELIMINARY_MATERIAL: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SFWIND: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    DUMMY_STPO_INCL_EEW_PS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    CUFACTOR: Optional[SapNvarchar] = 000000
    # SAP HANA type: NVARCHAR | Forced nullable
    SAPMP_MET_LRCH: Optional[SapNvarchar] = Field(alias="/SAPMP/MET_LRCH", default="")
    # SAP HANA type: DECIMAL | Forced nullable
    SAPMP_MAX_FERTL: Optional[SapDecimal] = Field(alias="/SAPMP/MAX_FERTL", default=0)
    # SAP HANA type: DECIMAL | Forced nullable
    SAPMP_FIX_AS_J: Optional[SapDecimal] = Field(alias="/SAPMP/FIX_AS_J", default=0)
    # SAP HANA type: DECIMAL | Forced nullable
    SAPMP_FIX_AS_E: Optional[SapDecimal] = Field(alias="/SAPMP/FIX_AS_E", default=0)
    # SAP HANA type: DECIMAL | Forced nullable
    SAPMP_FIX_AS_L: Optional[SapDecimal] = Field(alias="/SAPMP/FIX_AS_L", default=0)
    # SAP HANA type: NVARCHAR | Forced nullable
    SAPMP_ABL_ZAHL: Optional[SapNvarchar] = Field(alias="/SAPMP/ABL_ZAHL", default=000000)
    # SAP HANA type: DECIMAL | Forced nullable
    SAPMP_RUND_FAKT: Optional[SapDecimal] = Field(alias="/SAPMP/RUND_FAKT", default=0)
    # SAP HANA type: NVARCHAR | Forced nullable
    FSH_VMKZ: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FSH_PGQR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FSH_PGQRRF: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FSH_CRITICAL_COMP: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    FSH_CRITICAL_LEVEL: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    FUNCID: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    SERVICEDURATION: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    SERVICEDURATIONUNIT: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PRODUCTTYPE: Optional[SapNvarchar] = ""

class T681a(SapHanaBaseModel):
    """
    Model for SAP HANA table: T681A
    Schema: SAPHANADB
    """

    # SAP HANA type: NVARCHAR | Primary key | Order by field
    KAPPL: Key[SapNvarchar]

class T685h(SapHanaBaseModel):
    """
    Model for SAP HANA table: T685H
    Schema: SAPHANADB
    """

    # SAP HANA type: NVARCHAR | Primary key | Order by field
    MANDT: Key[SapNvarchar]
    # SAP HANA type: NVARCHAR | Primary key | Order by field
    KAPPL: Key[SapNvarchar]
    # SAP HANA type: NVARCHAR | Primary key
    KSCHL: Key[SapNvarchar]
    # SAP HANA type: NVARCHAR | Forced nullable
    CHSPL: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    CHANZ: Optional[SapNvarchar] = 0000
    # SAP HANA type: NVARCHAR | Forced nullable
    CHASP: Optional[SapNvarchar] = 000
    # SAP HANA type: NVARCHAR | Forced nullable
    CHMDG: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    CHMVS: Optional[SapNvarchar] = 000
    # SAP HANA type: NVARCHAR | Forced nullable
    CHMAN: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KZAME: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    CHDYN: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    CHCUA: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    CLINT_SEL: Optional[SapNvarchar] = 0000000000
    # SAP HANA type: NVARCHAR | Forced nullable
    CLINT_SRT: Optional[SapNvarchar] = 0000000000
    # SAP HANA type: NVARCHAR | Forced nullable
    CHVSK: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    CHVLL: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    CLASS_SEL: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    CLASS_SRT: Optional[SapNvarchar] = ""

class Tca01(SapHanaBaseModel):
    """
    Model for SAP HANA table: TCA01
    Schema: SAPHANADB
    """

    # SAP HANA type: NVARCHAR | Primary key | Order by field
    MANDT: Key[SapNvarchar]
    # SAP HANA type: NVARCHAR | Primary key | Order by field
    PLNTY: Key[SapNvarchar]
    # SAP HANA type: NVARCHAR | Forced nullable
    PLNAW: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    MATKZ: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    BLDTY: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    OBJECT: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    NKNRI: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    NKNRE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FLG_OPRSOP: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FLG_SEQ: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FLG_QSS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FLG_AOB: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FLG_UOBJ: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FLG_EQUI: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FLG_IFL: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FLG_INST: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SCREENTY: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FLG_REF: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FLG_PHAS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FLG_FEAT: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FLG_DOC: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FLG_PHYS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FLG_MST: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FLG_CHK: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PID_MAT: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PID_PLN: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FLG_STUELI: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PID_AUN: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FLG_GPOS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FLG_MKAL: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FLG_ERF_OP: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    OPR_BLDGR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    OPR_PANEL: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FLG_CHK_RE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FLG_ARBEI: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FLG_KALC: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FLG_CHRULE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FLG_LK_CHK: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FLG_MATCOM: Optional[SapNvarchar] = ""

class Ztggppconwipmat(SapHanaBaseModel):
    """
    Model for SAP HANA table: ZTGGPPCONWIPMAT
    Schema: SAPHANADB
    """

    # SAP HANA type: NVARCHAR | Primary key | Order by field
    MANDT: Key[SapNvarchar]
    # SAP HANA type: NVARCHAR | Primary key | Order by field
    TOP_WERKS: Key[SapNvarchar]
    # SAP HANA type: NVARCHAR | Primary key
    MATNR_TOP_LEVEL: Key[SapNvarchar]
    # SAP HANA type: NVARCHAR | Primary key
    LOW_WERKS: Key[SapNvarchar]
    # SAP HANA type: NVARCHAR | Primary key
    MATNR_LOWER_LEVEL: Key[SapNvarchar]
    # SAP HANA type: NVARCHAR | Forced nullable
    MTART: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    RAW_MATRIAL: Optional[SapNvarchar] = ""

class Aufk(SapHanaBaseModel):
    """
    Model for SAP HANA table: AUFK
    Schema: SAPHANADB
    """

    # SAP HANA type: NVARCHAR | Primary key | Order by field
    MANDT: Key[SapNvarchar]
    # SAP HANA type: NVARCHAR | Primary key | Order by field
    AUFNR: Key[SapNvarchar]
    # SAP HANA type: NVARCHAR | Forced nullable
    AUART: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    AUTYP: Optional[SapNvarchar] = 00
    # SAP HANA type: NVARCHAR | Forced nullable
    REFNR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ERNAM: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ERDAT: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    AENAM: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    AEDAT: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    KTEXT: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    LTEXT: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    BUKRS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    WERKS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    GSBER: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KOKRS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    CCKEY: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KOSTV: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    STORT: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SOWRK: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ASTKZ: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    WAERS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ASTNR: Optional[SapNvarchar] = 00
    # SAP HANA type: NVARCHAR | Forced nullable
    STDAT: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    ESTNR: Optional[SapNvarchar] = 00
    # SAP HANA type: NVARCHAR | Forced nullable
    PHAS0: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PHAS1: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PHAS2: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PHAS3: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PDAT1: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    PDAT2: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    PDAT3: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    IDAT1: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    IDAT2: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    IDAT3: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    OBJID: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    VOGRP: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    LOEKZ: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PLGKZ: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KVEWE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KAPPL: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KALSM: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ZSCHL: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ABKRS: Optional[SapNvarchar] = 00
    # SAP HANA type: NVARCHAR | Forced nullable
    KSTAR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KOSTL: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SAKNR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SETNM: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    CYCLE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SDATE: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    SEQNR: Optional[SapNvarchar] = 0000
    # SAP HANA type: NVARCHAR | Forced nullable
    USER0: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    USER1: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    USER2: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    USER3: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    USER4: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    USER5: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    USER6: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    USER7: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    USER8: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    USER9: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    OBJNR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PRCTR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PSPEL: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    AWSLS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ABGSL: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    TXJCD: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FUNC_AREA: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SCOPE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PLINT: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KDAUF: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KDPOS: Optional[SapNvarchar] = 000000
    # SAP HANA type: NVARCHAR | Forced nullable
    AUFEX: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    IVPRO: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    LOGSYSTEM: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FLG_MLTPS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ABUKR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    AKSTL: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SIZECL: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    IZWEK: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    UMWKZ: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KSTEMPF: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ZSCHM: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PKOSA: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ANFAUFNR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PROCNR: Optional[SapNvarchar] = 000000000000
    # SAP HANA type: NVARCHAR | Forced nullable
    PROTY: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    RSORD: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    BEMOT: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ADRNRA: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ERFZEIT: Optional[SapNvarchar] = 000000
    # SAP HANA type: NVARCHAR | Forced nullable
    AEZEIT: Optional[SapNvarchar] = 000000
    # SAP HANA type: NVARCHAR | Forced nullable
    CSTG_VRNT: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    COSTESTNR: Optional[SapNvarchar] = 000000000000
    # SAP HANA type: NVARCHAR | Forced nullable
    VERAA_USER: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    EEW_AUFK_PS_DUMMY: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    VNAME: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    RECID: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ETYPE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    OTYPE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    JV_JIBCL: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    JV_JIBSA: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    JV_OCO: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    CPD_UPDAT: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    CUM_INDCU: Optional[SapNvarchar] = Field(alias="/CUM/INDCU", default="")
    # SAP HANA type: NVARCHAR | Forced nullable
    CUM_CMNUM: Optional[SapNvarchar] = Field(alias="/CUM/CMNUM", default="")
    # SAP HANA type: NVARCHAR | Forced nullable
    CUM_AUEST: Optional[SapNvarchar] = Field(alias="/CUM/AUEST", default="")
    # SAP HANA type: NVARCHAR | Forced nullable
    CUM_DESNUM: Optional[SapNvarchar] = Field(alias="/CUM/DESNUM", default="")
    # SAP HANA type: NVARCHAR | Forced nullable
    AD01PROFNR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    VAPLZ: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    WAWRK: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FERC_IND: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    CLAIM_CONTROL: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    UPDATE_NEEDED: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    UPDATE_CONTROL: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    EB_POST: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ORDER_PROC_MODE: Optional[SapNvarchar] = ""
    # SAP HANA type: SMALLINT | Forced nullable
    AUFK_STATUS: Optional[SapSmallInt] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    EBW_KEY: Optional[SapNvarchar] = ""

class Ekko(SapHanaBaseModel):
    """
    Model for SAP HANA table: EKKO
    Schema: SAPHANADB
    """

    # SAP HANA type: NVARCHAR | Primary key | Order by field
    MANDT: Key[SapNvarchar]
    # SAP HANA type: NVARCHAR | Primary key
    EBELN: Key[SapNvarchar]
    # SAP HANA type: NVARCHAR | Forced nullable
    BUKRS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    BSTYP: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    BSART: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    BSAKZ: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    LOEKZ: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    STATU: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    AEDAT: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    ERNAM: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Order by field
    LASTCHANGEDATETIME: SapDecimal
    # SAP HANA type: NVARCHAR | Forced nullable
    PINCR: Optional[SapNvarchar] = 00000
    # SAP HANA type: NVARCHAR | Forced nullable
    LPONR: Optional[SapNvarchar] = 00000
    # SAP HANA type: NVARCHAR | Forced nullable
    LIFNR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SPRAS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ZTERM: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    ZBD1T: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    ZBD2T: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    ZBD3T: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    ZBD1P: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    ZBD2P: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    EKORG: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    EKGRP: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    WAERS: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    WKURS: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    KUFIX: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    BEDAT: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    KDATB: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    KDATE: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    BWBDT: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    ANGDT: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    BNDDT: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    GWLDT: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    AUSNR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ANGNR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    IHRAN: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    IHREZ: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    VERKF: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    TELF1: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    LLIEF: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KUNNR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ACTIVE_ID: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KONNR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ABGRU: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    AUTLF: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    WEAKT: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    RESWK: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    LBLIF: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    INCO1: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    INCO2: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    KTWRT: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    DISTRIBUTIONTYPE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SUBMI: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KNUMV: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KALSM: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    STAFO: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    LIFRE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    EXNUM: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    UNSEZ: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    LOGSY: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    UPINC: Optional[SapNvarchar] = 00000
    # SAP HANA type: NVARCHAR | Forced nullable
    STAKO: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FRGGR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FRGSX: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FRGKE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FRGZU: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FRGRL: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    LANDS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    LPHIS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ADRNR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    STCEG_L: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    STCEG: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ABSGR: Optional[SapNvarchar] = 00
    # SAP HANA type: NVARCHAR | Forced nullable
    ADDNR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KORNR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    MEMORY: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PROCSTAT: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PROCESS_INDICATOR: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    RLWRT: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    CR_STAT: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    REVNO: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SCMPROC: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    REASON_CODE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    MEMORYTYPE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    RETTP: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    RETPC: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    DPTYP: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    DPPCT: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    DPAMT: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    DPDAT: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    MSR_ID: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    HIERARCHY_EXISTS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    GROUPING_ID: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PARENT_ID: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    THRESHOLD_EXISTS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    LEGAL_CONTRACT: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    DESCRIPTION: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    RELEASE_DATE: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    VSART: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    HANDOVERLOC: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SHIPCOND: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    INCOV: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    INCO2_L: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    INCO3_L: Optional[SapNvarchar] = ""
    # SAP HANA type: VARBINARY | Nullable
    INCO2_KEY: Optional[SapVarbinary] = 00000000000000000000000000000000
    # SAP HANA type: VARBINARY | Nullable
    INCO3_KEY: Optional[SapVarbinary] = 00000000000000000000000000000000
    # SAP HANA type: VARBINARY | Nullable
    INCO4_KEY: Optional[SapVarbinary] = 00000000000000000000000000000000
    # SAP HANA type: NVARCHAR | Forced nullable
    GRWCU: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    INTRA_REL: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    INTRA_EXCL: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    TOTAL_STATUS_PCS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    TOTAL_STATUS_PMA: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    TOTAL_STATUS_DG: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    TOTAL_STATUS_SDS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    QTN_ERLST_SUBMSN_DATE: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    FOLLOWON_DOC_CAT: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FOLLOWON_DOC_TYPE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    DUMMY_EKKO_INCL_EEW_PS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    EXTERNALSYSTEM: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    EXTERNALREFERENCEID: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    EXT_REV_TMSTMP: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    ISEOPBLOCKED: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ISAGED: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FORCE_ID: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FORCE_CNT: Optional[SapNvarchar] = 000000
    # SAP HANA type: NVARCHAR | Forced nullable
    RELOC_ID: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    RELOC_SEQ_ID: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SOURCE_LOGSYS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FSH_TRANSACTION: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FSH_ITEM_GROUP: Optional[SapNvarchar] = 00000
    # SAP HANA type: NVARCHAR | Forced nullable
    FSH_VAS_LAST_ITEM: Optional[SapNvarchar] = 00000
    # SAP HANA type: NVARCHAR | Forced nullable
    FSH_OS_STG_CHANGE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    TMS_REF_UUID: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    DMBE_PAYMENTDEEMED: Optional[SapNvarchar] = Field(alias="/DMBE/PAYMENTDEEMED", default=00000000)
    # SAP HANA type: NVARCHAR | Forced nullable
    DMBE_DEALNUMBER: Optional[SapNvarchar] = Field(alias="/DMBE/DEALNUMBER", default="")
    # SAP HANA type: NVARCHAR | Forced nullable
    DMBE_EVGIDRENEWAL: Optional[SapNvarchar] = Field(alias="/DMBE/EVGIDRENEWAL", default="")
    # SAP HANA type: NVARCHAR | Forced nullable
    DMBE_EVGIDCANCEL: Optional[SapNvarchar] = Field(alias="/DMBE/EVGIDCANCEL", default="")
    # SAP HANA type: NVARCHAR | Forced nullable
    ZAPCGK: Optional[SapNvarchar] = 0000
    # SAP HANA type: NVARCHAR | Forced nullable
    APCGK_EXTEND: Optional[SapNvarchar] = 0000000000
    # SAP HANA type: NVARCHAR | Forced nullable
    ZBAS_DATE: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    ZADATTYP: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ZSTART_DAT: Optional[SapNvarchar] = 00000000
    # SAP HANA type: DECIMAL | Forced nullable
    Z_DEV: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    ZINDANX: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ZLIMIT_DAT: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    NUMERATOR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    HASHCAL_BDAT: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    HASHCAL: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    NEGATIVE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    HASHCAL_EXISTS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KNOWN_INDEX: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    POSTAT: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    VZSKZ: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FSH_SNST_STATUS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PROCE: Optional[SapNvarchar] = 000000000
    # SAP HANA type: NVARCHAR | Forced nullable
    CONC: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    CONT: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    COMP: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    OUTR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    DESP: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    DESP_DAT: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    DESP_CARGO: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PARE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PARE_DAT: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    PARE_CARGO: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PFM_CONTRACT: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    POHF_TYPE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    EQ_EINDT: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    EQ_WERKS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FIXPO: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    EKGRP_ALLOW: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    WERKS_ALLOW: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    CONTRACT_ALLOW: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PSTYP_ALLOW: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FIXPO_ALLOW: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KEY_ID_ALLOW: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    AUREL_ALLOW: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    DELPER_ALLOW: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    EINDT_ALLOW: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    LTSNR_ALLOW: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    OTB_LEVEL: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    OTB_COND_TYPE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KEY_ID: Optional[SapNvarchar] = 0000000000000000
    # SAP HANA type: DECIMAL | Forced nullable
    OTB_VALUE: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    OTB_CURR: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    OTB_RES_VALUE: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    OTB_SPEC_VALUE: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    SPR_RSN_PROFILE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    BUDG_TYPE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    OTB_STATUS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    OTB_REASON: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    CHECK_TYPE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    CON_OTB_REQ: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    CON_PREBOOK_LEV: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    CON_DISTR_LEV: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    HAS_CATALOG_RELEVANT_ITEMS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ZHDCONTRACT: Optional[SapNvarchar] = ""

class Ekpo(SapHanaBaseModel):
    """
    Model for SAP HANA table: EKPO
    Schema: SAPHANADB
    """

    # SAP HANA type: NVARCHAR | Primary key | Order by field
    MANDT: Key[SapNvarchar]
    # SAP HANA type: NVARCHAR | Primary key
    EBELN: Key[SapNvarchar]
    # SAP HANA type: NVARCHAR | Primary key
    EBELP: Key[SapNvarchar]
    # SAP HANA type: NVARCHAR | Forced nullable
    UNIQUEID: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    LOEKZ: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    STATU: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    AEDAT: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    TXZ01: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    MATNR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    EMATN: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    BUKRS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    WERKS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    LGORT: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    BEDNR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    MATKL: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    INFNR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    IDNLF: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    KTMNG: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    MENGE: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    MEINS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    BPRME: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    BPUMZ: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    BPUMN: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    UMREZ: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    UMREN: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    NETPR: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    PEINH: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    NETWR: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    BRTWR: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    AGDAT: Optional[SapNvarchar] = 00000000
    # SAP HANA type: DECIMAL | Forced nullable
    WEBAZ: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    MWSKZ: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    TXDAT_FROM: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    TXDAT: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    TAX_COUNTRY: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    BONUS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    INSMK: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SPINF: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PRSDR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SCHPR: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    MAHNZ: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    MAHN1: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    MAHN2: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    MAHN3: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    UEBTO: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    UEBTK: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    UNTTO: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    BWTAR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    BWTTY: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ABSKZ: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    AGMEM: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ELIKZ: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    EREKZ: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PSTYP: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KNTTP: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KZVBR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    VRTKZ: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    TWRKZ: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    WEPOS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    WEUNB: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    REPOS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    WEBRE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KZABS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    LABNR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KONNR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KTPNR: Optional[SapNvarchar] = 00000
    # SAP HANA type: NVARCHAR | Forced nullable
    ABDAT: Optional[SapNvarchar] = 00000000
    # SAP HANA type: DECIMAL | Forced nullable
    ABFTZ: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    ETFZ1: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    ETFZ2: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    KZSTU: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    NOTKZ: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    LMEIN: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    EVERS: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    ZWERT: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    NAVNW: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    ABMNG: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    PRDAT: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    BSTYP: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    EFFWR: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    XOBLR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KUNNR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ADRNR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    EKKOL: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SKTOF: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    STAFO: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    PLIFZ: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    NTGEW: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    GEWEI: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    TXJCD: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ETDRK: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SOBKZ: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ARSNR: Optional[SapNvarchar] = 0000000000
    # SAP HANA type: NVARCHAR | Forced nullable
    ARSPS: Optional[SapNvarchar] = 0000
    # SAP HANA type: NVARCHAR | Forced nullable
    INSNC: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SSQSS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ZGTYP: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    EAN11: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    BSTAE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    REVLV: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    GEBER: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FISTL: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FIPOS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KO_GSBER: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KO_PARGB: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KO_PRCTR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KO_PPRCTR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    MEPRF: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    BRGEW: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    VOLUM: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    VOLEH: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    INCO1: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    INCO2: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    VORAB: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KOLIF: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    LTSNR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PACKNO: Optional[SapNvarchar] = 0000000000
    # SAP HANA type: NVARCHAR | Forced nullable
    FPLNR: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    GNETWR: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    STAPO: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    UEBPO: Optional[SapNvarchar] = 00000
    # SAP HANA type: NVARCHAR | Forced nullable
    LEWED: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    EMLIF: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    LBLKZ: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SATNR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ATTYP: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    VSART: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    HANDOVERLOC: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KANBA: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ADRN2: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    DELIVERY_ADDRESS_TYPE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    CUOBJ: Optional[SapNvarchar] = 000000000000000000
    # SAP HANA type: NVARCHAR | Forced nullable
    XERSY: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    EILDT: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    DRDAT: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    DRUHR: Optional[SapNvarchar] = 000000
    # SAP HANA type: NVARCHAR | Forced nullable
    DRUNR: Optional[SapNvarchar] = 0000
    # SAP HANA type: NVARCHAR | Forced nullable
    AKTNR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ABELN: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ABELP: Optional[SapNvarchar] = 00000
    # SAP HANA type: DECIMAL | Forced nullable
    ANZPU: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    PUNEI: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SAISO: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SAISJ: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    EBON2: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    EBON3: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    EBONF: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    MLMAA: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    MHDRZ: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    ANFNR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ANFPS: Optional[SapNvarchar] = 00000
    # SAP HANA type: NVARCHAR | Forced nullable
    KZKFG: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    USEQU: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    UMSOK: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    BANFN: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    BNFPO: Optional[SapNvarchar] = 00000
    # SAP HANA type: NVARCHAR | Forced nullable
    MTART: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    UPTYP: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    UPVOR: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    KZWI1: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    KZWI2: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    KZWI3: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    KZWI4: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    KZWI5: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    KZWI6: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    SIKGR: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    MFZHI: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    FFZHI: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    RETPO: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    AUREL: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    BSGRU: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    LFRET: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    MFRGR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    NRFHG: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    J_1BNBM: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    J_1BMATUSE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    J_1BMATORG: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    J_1BOWNPRO: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    J_1BINDUST: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ABUEB: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    NLABD: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    NFABD: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    KZBWS: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    BONBA: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    FABKZ: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    LOADINGPOINT: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    J_1AINDXP: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    J_1AIDATEP: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    MPROF: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    EGLKZ: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KZTLF: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KZFME: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    RDPRF: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    TECHS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    CHG_SRV: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    CHG_FPLNR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    MFRPN: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    MFRNR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    EMNFR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    NOVET: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    AFNAM: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    TZONRC: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    IPRKZ: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    LEBRE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    BERID: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    XCONDITIONS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    APOMS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    CCOMP: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    GRANT_NBR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FKBER: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    STATUS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    RESLO: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KBLNR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KBLPOS: Optional[SapNvarchar] = 000
    # SAP HANA type: NVARCHAR | Forced nullable
    PS_PSP_PNR: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    KOSTL: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SAKTO: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    WEORA: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SRV_BAS_COM: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PRIO_URG: Optional[SapNvarchar] = 00
    # SAP HANA type: NVARCHAR | Forced nullable
    PRIO_REQ: Optional[SapNvarchar] = 000
    # SAP HANA type: NVARCHAR | Forced nullable
    EMPST: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    DIFF_INVOICE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    TRMRISK_RELEVANT: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    CREATIONDATE: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Order by field
    CREATIONTIME: SapNvarchar
    # SAP HANA type: NVARCHAR | Forced nullable
    VCM_CHAIN_CATEGORY: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SPE_ABGRU: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SPE_CRM_SO: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SPE_CRM_SO_ITEM: Optional[SapNvarchar] = 000000
    # SAP HANA type: NVARCHAR | Forced nullable
    SPE_CRM_REF_SO: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SPE_CRM_REF_ITEM: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SPE_CRM_FKREL: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SPE_CHNG_SYS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SPE_INSMK_SRC: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SPE_CQ_CTRLTYPE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SPE_CQ_NOCQ: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    REASON_CODE: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    CQU_SAR: Optional[SapDecimal] = 0
    # SAP HANA type: INTEGER | Forced nullable
    ANZSN: Optional[SapInteger] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    SPE_EWM_DTC: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    EXLIN: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    EXSNR: Optional[SapNvarchar] = 00000
    # SAP HANA type: NVARCHAR | Forced nullable
    EHTYP: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    RETPC: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    DPTYP: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    DPPCT: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    DPAMT: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    DPDAT: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    FLS_RSTO: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    EXT_RFX_NUMBER: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    EXT_RFX_ITEM: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    EXT_RFX_SYSTEM: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SRM_CONTRACT_ID: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SRM_CONTRACT_ITM: Optional[SapNvarchar] = 0000000000
    # SAP HANA type: NVARCHAR | Forced nullable
    GOODS_COUNT_CORRECTION: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    LIFEX: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    LIFEXPOS: Optional[SapNvarchar] = 000000
    # SAP HANA type: NVARCHAR | Forced nullable
    BLK_REASON_ID: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    BLK_REASON_TXT: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ITCONS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FIXMG: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    WABWE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    CMPL_DLV_ITM: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    INCO2_L: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    INCO3_L: Optional[SapNvarchar] = ""
    # SAP HANA type: VARBINARY | Nullable
    INCO2_KEY: Optional[SapVarbinary] = 00000000000000000000000000000000
    # SAP HANA type: VARBINARY | Nullable
    INCO3_KEY: Optional[SapVarbinary] = 00000000000000000000000000000000
    # SAP HANA type: VARBINARY | Nullable
    INCO4_KEY: Optional[SapVarbinary] = 00000000000000000000000000000000
    # SAP HANA type: NVARCHAR | Forced nullable
    STAWN: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ISVCO: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    GRWRT: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    SERVICEPERFORMER: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PRODUCTTYPE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    GR_BY_SES: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PRICE_CHANGE_IN_SES_ALLOWED: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    REQUESTFORQUOTATION: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    REQUESTFORQUOTATIONITEM: Optional[SapNvarchar] = 00000
    # SAP HANA type: NVARCHAR | Forced nullable
    RENEGOTIATION_STATUS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    STATUS_PCS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    STATUS_PMA: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    STATUS_DG: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    STATUS_SDS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    EXTMATERIALFORPURG: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PROCMT_HUB_SOURCE_SYSTEM: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    TARGET_VALUE: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    EXTERNALREFERENCEID: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    TC_AUT_DET: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    MANUAL_TC_REASON: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FISCAL_INCENTIVE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    TAX_SUBJECT_ST: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FISCAL_INCENTIVE_ID: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SF_TXJCD: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    DUMMY_EKPO_INCL_EEW_PS: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    EXPECTED_VALUE: Optional[SapDecimal] = 0
    # SAP HANA type: DECIMAL | Forced nullable
    LIMIT_AMOUNT: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    CONTRACT_FOR_LIMIT: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ENH_DATE1: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    ENH_DATE2: Optional[SapNvarchar] = 00000000
    # SAP HANA type: DECIMAL | Forced nullable
    ENH_PERCENT: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    ENH_NUMC1: Optional[SapNvarchar] = 0000000000
    # SAP HANA type: NVARCHAR | Forced nullable
    DATAAGING: Optional[SapNvarchar] = Field(alias="_DATAAGING", default=00000000)
    # SAP HANA type: NVARCHAR | Forced nullable
    CUPIT: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    CIGIT: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    MGOIT: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    TXS_BUSINESS_TRANSACTION: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    TXS_MATERIAL_USAGE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    TXS_USAGE_PURPOSE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    BEV1_NEGEN_ITEM: Optional[SapNvarchar] = Field(alias="/BEV1/NEGEN_ITEM", default="")
    # SAP HANA type: NVARCHAR | Forced nullable
    BEV1_NEDEPFREE: Optional[SapNvarchar] = Field(alias="/BEV1/NEDEPFREE", default="")
    # SAP HANA type: NVARCHAR | Forced nullable
    BEV1_NESTRUCCAT: Optional[SapNvarchar] = Field(alias="/BEV1/NESTRUCCAT", default="")
    # SAP HANA type: NVARCHAR | Forced nullable
    ADVCODE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    BUDGET_PD: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    EXCPE: Optional[SapNvarchar] = 00
    # SAP HANA type: NVARCHAR | Forced nullable
    FMFGUS_KEY: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    IUID_RELEVANT: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    MRPIND: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SGT_SCAT: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SGT_RCAT: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    TMS_REF_UUID: Optional[SapNvarchar] = ""
    # SAP HANA type: VARBINARY | Nullable
    TMS_SRC_LOC_KEY: Optional[SapVarbinary] = 00000000000000000000000000000000
    # SAP HANA type: VARBINARY | Nullable
    TMS_DES_LOC_KEY: Optional[SapVarbinary] = 00000000000000000000000000000000
    # SAP HANA type: NVARCHAR | Forced nullable
    WRF_CHARSTC1: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    WRF_CHARSTC2: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    WRF_CHARSTC3: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    REFSITE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    DMBE_OPTIONALITYKEY: Optional[SapNvarchar] = Field(alias="/DMBE/OPTIONALITYKEY", default=0000)
    # SAP HANA type: NVARCHAR | Forced nullable
    DMBE_OPTIONALITYFOR: Optional[SapNvarchar] = Field(alias="/DMBE/OPTIONALITYFOR", default=0000)
    # SAP HANA type: NVARCHAR | Forced nullable
    DMBE_CIMAX2: Optional[SapNvarchar] = Field(alias="/DMBE/CIMAX2", default="")
    # SAP HANA type: NVARCHAR | Forced nullable
    DMBE_ITEM_TYPE: Optional[SapNvarchar] = Field(alias="/DMBE/ITEM_TYPE", default="")
    # SAP HANA type: NVARCHAR | Forced nullable
    DMBE_EFFECTIVEDATEFROM: Optional[SapNvarchar] = Field(alias="/DMBE/EFFECTIVEDATEFROM", default=00000000)
    # SAP HANA type: NVARCHAR | Forced nullable
    DMBE_EFFECTIVEDATETO: Optional[SapNvarchar] = Field(alias="/DMBE/EFFECTIVEDATETO", default=00000000)
    # SAP HANA type: NVARCHAR | Forced nullable
    DMBE_OPTIONOF: Optional[SapNvarchar] = Field(alias="/DMBE/OPTIONOF", default=00000)
    # SAP HANA type: NVARCHAR | Forced nullable
    DMBE_ACCOUNTING_TYPE: Optional[SapNvarchar] = Field(alias="/DMBE/ACCOUNTING_TYPE", default="")
    # SAP HANA type: NVARCHAR | Forced nullable
    DMBE_FAS_CODE: Optional[SapNvarchar] = Field(alias="/DMBE/FAS_CODE", default="")
    # SAP HANA type: NVARCHAR | Forced nullable
    DMBE_SCHEDULING_DESK: Optional[SapNvarchar] = Field(alias="/DMBE/SCHEDULING_DESK", default="")
    # SAP HANA type: NVARCHAR | Forced nullable
    DMBE_COMPONENTFOR: Optional[SapNvarchar] = Field(alias="/DMBE/COMPONENTFOR", default=0000)
    # SAP HANA type: NVARCHAR | Forced nullable
    DMBE_MIXEDPRODUCT: Optional[SapNvarchar] = Field(alias="/DMBE/MIXEDPRODUCT", default="")
    # SAP HANA type: NVARCHAR | Forced nullable
    DMBE_POSTEDDATE: Optional[SapNvarchar] = Field(alias="/DMBE/POSTEDDATE", default=00000000)
    # SAP HANA type: NVARCHAR | Forced nullable
    DMBE_DEAL_POSTED: Optional[SapNvarchar] = Field(alias="/DMBE/DEAL_POSTED", default="")
    # SAP HANA type: NVARCHAR | Forced nullable
    DMBE_INVOICEUOM: Optional[SapNvarchar] = Field(alias="/DMBE/INVOICEUOM", default="")
    # SAP HANA type: NVARCHAR | Forced nullable
    ZAPCGK: Optional[SapNvarchar] = 0000
    # SAP HANA type: NVARCHAR | Forced nullable
    APCGK_EXTEND: Optional[SapNvarchar] = 0000000000
    # SAP HANA type: NVARCHAR | Forced nullable
    ZBAS_DATE: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    ZADATTYP: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ZSTART_DAT: Optional[SapNvarchar] = 00000000
    # SAP HANA type: DECIMAL | Forced nullable
    Z_DEV: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    ZINDANX: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ZLIMIT_DAT: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    NUMERATOR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    HASHCAL_BDAT: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    HASHCAL: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    NEGATIVE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    HASHCAL_EXISTS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KNOWN_INDEX: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SAPMP_GPOSE: Optional[SapNvarchar] = Field(alias="/SAPMP/GPOSE", default=00000)
    # SAP HANA type: NVARCHAR | Forced nullable
    ANGPN: Optional[SapNvarchar] = 000000
    # SAP HANA type: NVARCHAR | Forced nullable
    ADMOI: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ADPRI: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    LPRIO: Optional[SapNvarchar] = 00
    # SAP HANA type: NVARCHAR | Forced nullable
    ADACN: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    AFPNR: Optional[SapNvarchar] = 000000
    # SAP HANA type: NVARCHAR | Forced nullable
    BSARK: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    AUDAT: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    ANGNR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PNSTAT: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ADDNS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ASSIGNMENT_PRIORITY: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ARUN_GROUP_PRIO: Optional[SapNvarchar] = ""
    # SAP HANA type: INTEGER | Forced nullable
    ARUN_ORDER_PRIO: Optional[SapInteger] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    SERRU: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SERNP: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    DISUB_SOBKZ: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    DISUB_PSPNR: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    DISUB_KUNNR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    DISUB_VBELN: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    DISUB_POSNR: Optional[SapNvarchar] = 000000
    # SAP HANA type: NVARCHAR | Forced nullable
    DISUB_OWNER: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FSH_SEASON_YEAR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FSH_SEASON: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FSH_COLLECTION: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FSH_THEME: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FSH_ATP_DATE: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    FSH_VAS_REL: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FSH_VAS_PRNT_ID: Optional[SapNvarchar] = 00000
    # SAP HANA type: NVARCHAR | Forced nullable
    FSH_TRANSACTION: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FSH_ITEM_GROUP: Optional[SapNvarchar] = 00000
    # SAP HANA type: NVARCHAR | Forced nullable
    FSH_ITEM: Optional[SapNvarchar] = 00000
    # SAP HANA type: NVARCHAR | Forced nullable
    FSH_SS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FSH_GRID_COND_REC: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    FSH_PSM_PFM_SPLIT: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    CNFM_QTY: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    FSH_PQR_UEPOS: Optional[SapNvarchar] = 000000
    # SAP HANA type: NVARCHAR | Forced nullable
    RFM_DIVERSION: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    RFM_SCC_INDICATOR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    STPAC: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    LGBZO: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    LGBZO_B: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ADDRNUM: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    CONSNUM: Optional[SapNvarchar] = 000
    # SAP HANA type: NVARCHAR | Forced nullable
    BORGR_MISS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    DEP_ID: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    BELNR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KBLPOS_CAB: Optional[SapNvarchar] = 000
    # SAP HANA type: NVARCHAR | Forced nullable
    KBLNR_COMP: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KBLPOS_COMP: Optional[SapNvarchar] = 000
    # SAP HANA type: NVARCHAR | Forced nullable
    WBS_ELEMENT: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    RFM_PSST_RULE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    RFM_PSST_GROUP: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    RFM_REF_DOC: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    RFM_REF_ITEM: Optional[SapNvarchar] = 000000
    # SAP HANA type: NVARCHAR | Forced nullable
    RFM_REF_ACTION: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    RFM_REF_SLITEM: Optional[SapNvarchar] = 0000
    # SAP HANA type: NVARCHAR | Forced nullable
    REF_ITEM: Optional[SapNvarchar] = 00000
    # SAP HANA type: NVARCHAR | Forced nullable
    SOURCE_ID: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SOURCE_KEY: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    PUT_BACK: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    POL_ID: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    CONS_ORDER: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    IS_CATALOG_RELEVANT: Optional[SapNvarchar] = ""
    # SAP HANA type: VARBINARY | Forced nullable
    PFMTRANSDATAFOOTPRINTUUID: Optional[SapVarbinary] = 00000000000000000000000000000000

class Equi(SapHanaBaseModel):
    """
    Model for SAP HANA table: EQUI
    Schema: SAPHANADB
    """

    # SAP HANA type: NVARCHAR | Primary key | Order by field
    MANDT: Key[SapNvarchar]
    # SAP HANA type: NVARCHAR | Primary key
    EQUNR: Key[SapNvarchar]
    # SAP HANA type: NVARCHAR | Forced nullable
    ERDAT: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    ERNAM: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    EQASP: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    AEDAT: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    AENAM: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    BEGRU: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    EQTYP: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    EQART: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    LVORM: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    INVNR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    GROES: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Forced nullable
    BRGEW: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    GEWEI: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ANSDT: Optional[SapNvarchar] = 00000000
    # SAP HANA type: DECIMAL | Forced nullable
    ANSWT: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    WAERS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ELIEF: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    GWLEN: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    GWLDT: Optional[SapNvarchar] = 00000000
    # SAP HANA type: DECIMAL | Forced nullable
    WDBWT: Optional[SapDecimal] = 0
    # SAP HANA type: NVARCHAR | Forced nullable
    HERST: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    HERLD: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    HZEIN: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SERGE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    TYPBZ: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    BAUJJ: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    BAUMM: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    APLKZ: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    AULDT: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    INBDT: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    GERNR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    EQLFN: Optional[SapNvarchar] = 000
    # SAP HANA type: NVARCHAR | Forced nullable
    GWLDV: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    EQDAT: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    EQBER: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    EQNUM: Optional[SapNvarchar] = 000000000
    # SAP HANA type: NVARCHAR | Forced nullable
    OBJNR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    EQSNR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    CUOBJ: Optional[SapNvarchar] = 000000000000000000
    # SAP HANA type: NVARCHAR | Forced nullable
    KRFKZ: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KMATN: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    MATNR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SERNR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    WERK: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    LAGER: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    CHARGE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    KUNDE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    WARPL: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    IMRC_POINT: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    REVLV: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    MGANR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    BEGRUI: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    S_EQUI: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    S_SERIAL: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    S_KONFI: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    S_SALE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    S_FHM: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    S_ELSE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    S_ISU: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    S_EQBS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    S_FLEET: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    BSTVP: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SPARTE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    HANDLE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    TSEGTP: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    EMATN: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    ACT_CHANGE_AA: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    S_CC: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    DATLWB: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    UII: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    IUID_TYPE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    UII_PLANT: Optional[SapNvarchar] = ""
    # SAP HANA type: DECIMAL | Order by field
    CHANGEDDATETIME: SapDecimal
    # SAP HANA type: NVARCHAR | Forced nullable
    ENDOFUSE: Optional[SapNvarchar] = 00000000
    # SAP HANA type: NVARCHAR | Forced nullable
    DUMMY_EQUI_INCL_EEW_PS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    EQEXT_ACTIVE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    EQUI_SRTYPE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    EQUI_SNTYPE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    EQLB_DUTY: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    EQLB_HIDE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    J_3GDISPO: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    J_3GZDEQUI: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    J_3GEQART: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    J_3GKZMENG: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    J_3GKONDE: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    J_3GFIKTIV: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    J_3GBELTYP: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    MEINS: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    J_3GKZLADG: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    J_3GKZBERG: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    J_3GEIFR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    J_3GVERMEIN: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    J_3GZULNR: Optional[SapNvarchar] = ""
    # SAP HANA type: NVARCHAR | Forced nullable
    SAPCEM_ABRECHVH: Optional[SapNvarchar] = Field(alias="/SAPCEM/ABRECHVH", default="")
    # SAP HANA type: NVARCHAR | Forced nullable
    SAPCEM_ABRECHLG: Optional[SapNvarchar] = Field(alias="/SAPCEM/ABRECHLG", default="")
    # SAP HANA type: NVARCHAR | Forced nullable
    SAPCEM_DISPOGR: Optional[SapNvarchar] = Field(alias="/SAPCEM/DISPOGR", default="")
    # SAP HANA type: NVARCHAR | Forced nullable
    EQUIPMENTOID: Optional[SapNvarchar] = ""

adrc = OlapTable[Adrc]("ADRC")
adrv = OlapTable[Adrv]("ADRV")
aeoi = OlapTable[Aeoi]("AEOI")
afko = OlapTable[Afko]("AFKO")
afpo = OlapTable[Afpo]("AFPO")
afvc = OlapTable[Afvc]("AFVC")
afvv = OlapTable[Afvv]("AFVV")
bp030 = OlapTable[Bp030]("BP030")
but000 = OlapTable[But000]("BUT000")
but020 = OlapTable[But020]("BUT020")
but050 = OlapTable[But050]("BUT050")
but100 = OlapTable[But100]("BUT100")
cabn = OlapTable[Cabn]("CABN")
cawn = OlapTable[Cawn]("CAWN")
crca = OlapTable[Crca]("CRCA")
crfh = OlapTable[Crfh]("CRFH")
crhd = OlapTable[Crhd]("CRHD")
crtx = OlapTable[Crtx]("CRTX")
dd01_t = OlapTable[Dd01t]("DD01T")
dd02_l = OlapTable[Dd02l]("DD02L")
dd02_t = OlapTable[Dd02t]("DD02T")
eban = OlapTable[Eban]("EBAN")
ekkn = OlapTable[Ekkn]("EKKN")
ekko = OlapTable[Ekko]("EKKO")
ekpo = OlapTable[Ekpo]("EKPO")
kna1 = OlapTable[Kna1]("KNA1")
knvv = OlapTable[Knvv]("KNVV")
konp = OlapTable[Konp]("KONP")
koth030 = OlapTable[Koth030]("KOTH030")
lfa1 = OlapTable[Lfa1]("LFA1")
lfm1 = OlapTable[Lfm1]("LFM1")
lfm2 = OlapTable[Lfm2]("LFM2")
makt = OlapTable[Makt]("MAKT")
mapl = OlapTable[Mapl]("MAPL")
mara = OlapTable[Mara]("MARA")
marc = OlapTable[Marc]("MARC")
mard = OlapTable[Mard]("MARD")
mast = OlapTable[Mast]("MAST")
matdoc = OlapTable[Matdoc]("MATDOC", OlapConfig(
    order_by_fields=["MANDT", "KEY1"]
))
mbew = OlapTable[Mbew]("MBEW")
mdma = OlapTable[Mdma]("MDMA")
mkal = OlapTable[Mkal]("MKAL")
mlan = OlapTable[Mlan]("MLAN")
mvke = OlapTable[Mvke]("MVKE")
pkhd = OlapTable[Pkhd]("PKHD")
plaf = OlapTable[Plaf]("PLAF")
plko = OlapTable[Plko]("PLKO")
plmk = OlapTable[Plmk]("PLMK")
plmz = OlapTable[Plmz]("PLMZ")
plpo = OlapTable[Plpo]("PLPO")
qmat = OlapTable[Qmat]("QMAT")
stko = OlapTable[Stko]("STKO")
stpo = OlapTable[Stpo]("STPO")
t681_a = OlapTable[T681a]("T681A")
t685_h = OlapTable[T685h]("T685H")
tca01 = OlapTable[Tca01]("TCA01")
ztggppconwipmat = OlapTable[Ztggppconwipmat]("ZTGGPPCONWIPMAT")
aufk = OlapTable[Aufk]("AUFK")
ekko = OlapTable[Ekko]("EKKO")
ekpo = OlapTable[Ekpo]("EKPO")
equi = OlapTable[Equi]("EQUI")