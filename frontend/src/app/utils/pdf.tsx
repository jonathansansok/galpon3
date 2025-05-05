import React from 'react';
import NextImage from "next/image";
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';

// Define los estilos
const styles = StyleSheet.create({
  page: {
    padding: 30,
  },
  table: {
    display: "flex",
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: {
    flexDirection: "row",
  },
  tableCol: {
    width: "25%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableCell: {
    margin: "auto",
    marginTop: 5,
    fontSize: 10,
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
});

interface Ingreso {
  apellido: string;
  nombres: string;
  alias: string;
  tipoDoc: string;
  numeroDni: string;
  lpu: string;
  lpuProv: string;
  unidadDeIngreso: string;
  fechaIngreso: string;
  fechaNacimiento: string;
  edad: string;
  observacion: string;
  nacionalidad: string;
  provincia: string;
  ubicacionMap: string;
  establecimiento: string;
  sitProc: string;
  sexo: string;
  subGrupo: string;
  sexualidad: string;
  estadoCivil: string;
  profesion: string;
  titInfoPublic: string;
  resumen: string;
  imagen?: string;
  tatuajes?: Tatuaje[];
  cicatrices?: Herida[];
}

interface Tatuaje {
  zona: string;
  details: string[];
}

interface Herida {
  zona: string;
  type: string;
  detail: string;
}

const IngresoPDF: React.FC<{ ingreso: Ingreso }> = ({ ingreso }) => (
  <Document>
    <Page style={styles.page}>
      <View style={styles.table}>
        <View style={styles.tableRow}>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>Apellido</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>{ingreso.apellido}</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>Nombres</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>{ingreso.nombres}</Text>
          </View>
        </View>
        <View style={styles.tableRow}>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>Alias</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>{ingreso.alias}</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>Tipo de Documento</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>{ingreso.tipoDoc}</Text>
          </View>
        </View>
        <View style={styles.tableRow}>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>Número de Documento</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>{ingreso.numeroDni}</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>L.P.U</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>{ingreso.lpu}</Text>
          </View>
        </View>
        <View style={styles.tableRow}>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>L.P.U Prov.</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>{ingreso.lpuProv}</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>Unidad de Ingreso</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>{ingreso.unidadDeIngreso}</Text>
          </View>
        </View>
        <View style={styles.tableRow}>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>Fecha de Ingreso</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>{ingreso.fechaIngreso}</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>Fecha de Nacimiento</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>{ingreso.fechaNacimiento}</Text>
          </View>
        </View>
        <View style={styles.tableRow}>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>Edad</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>{ingreso.edad}</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>Observaciones</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>{ingreso.observacion}</Text>
          </View>
        </View>
        <View style={styles.tableRow}>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>Nacionalidad</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>{ingreso.nacionalidad}</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>Provincia</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>{ingreso.provincia}</Text>
          </View>
        </View>
        <View style={styles.tableRow}>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>Ubicación en el Mapa</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>{ingreso.ubicacionMap}</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>Establecimiento</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>{ingreso.establecimiento}</Text>
          </View>
        </View>
        <View style={styles.tableRow}>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>Situación Procesal</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>{ingreso.sitProc}</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>Sexo</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>{ingreso.sexo}</Text>
          </View>
        </View>
        <View style={styles.tableRow}>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>Subgrupo</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>{ingreso.subGrupo}</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>Sexualidad</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>{ingreso.sexualidad}</Text>
          </View>
        </View>
        <View style={styles.tableRow}>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>Estado Civil</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>{ingreso.estadoCivil}</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>Profesión</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>{ingreso.profesion}</Text>
          </View>
        </View>
        <View style={styles.tableRow}>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>Título de Información Pública</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>{ingreso.titInfoPublic}</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>Resumen</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>{ingreso.resumen}</Text>
          </View>
        </View>
        {ingreso.imagen && (
          <View style={styles.tableRow}>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>Imagen</Text>
            </View>
            <View style={styles.tableCol}>
              <NextImage  alt="foto-cuerpo" style={styles.image} src={ingreso.imagen} />
            </View>
          </View>
        )}
        {ingreso.tatuajes && ingreso.tatuajes.length > 0 && (
          <View style={styles.tableRow}>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>Tatuajes</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>
                {ingreso.tatuajes.map((tatuaje, index) => (
                  <Text key={index}>
                    {tatuaje.zona}: {tatuaje.details.join(", ")}
                  </Text>
                ))}
              </Text>
            </View>
          </View>
        )}
        {ingreso.cicatrices && ingreso.cicatrices.length > 0 && (
          <View style={styles.tableRow}>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>Cicatrices</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>
                {ingreso.cicatrices.map((cicatriz, index) => (
                  <Text key={index}>
                    {cicatriz.zona}: {cicatriz.type} - {cicatriz.detail}
                  </Text>
                ))}
              </Text>
            </View>
          </View>
        )}
      </View>
    </Page>
  </Document>
);

export default IngresoPDF;