import { useState, useEffect } from "react";
import { Button, Form } from "react-bootstrap";
import { toast } from "react-toastify";

import ListView from "../../components/ListView/index";
import Modal from "../../components/Modal/index";
import Page from "../../components/Page/index";
import api from "../../services/axios";


const endpoint = "/professors";

const columns = [
  {
    value: "CPF",
    id: "cpf",
  },
  {
    value: "department",
    id: "department",
    render: (department) => department.name,
  },
  {
    value: "ID",
    id: "Id",
  },
  {
    value: "Name",
    id: "name"
  },
];

const INITIAL_STATE = {
  id: 0,
  name: "",
  cpf: "",
  departmentId: 0,
};


const Professor = () => {
  const [visible, setVisible] = useState(false);
  const [department, setDepartments] = useState([]);
  const [professor, setprofessor] = useState(INITIAL_STATE);
  const [Courses, setCourse] = useState([]);

  useEffect(() => {
    api
      .get("/departments")
      .then((response) => {
        setDepartments(response.data);
      })
      .catch((error) => {
        toast.error(error.message);
      });
  }, []);

  const handleSave = async (refetch) => {
    try {
      if (professor.id) {
        await api.put(`${endpoint}/${professor.id}`, {
          name: professor.name,
        });

        toast.success("Atualizado com sucesso!");
      } else {
        await api.post(endpoint, { name: professor.name });

        toast.success("Cadastrado com sucesso!");
      }

      setVisible(false);

      await refetch();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const actions = [
    {
      name: "Edit",
      action: (_professor) => {
        setCourse(_professor);
        setVisible(true);
      },
    },
    {
      name: "Remove",
      action: async (item, refetch) => {
        if (window.confirm("Você tem certeza que deseja remover?")) {
          try {
            await api.delete(`${endpoint}/${item.id}`);
            await refetch();
            toast.info(`${item.name} foi removido`);
          } catch (error) {
            toast.info(error.message);
          }
        }
      },
    },
  ];

  return (
    <Page title="Professor">
      <Button
        className="mb-2"
        onClick={() => {
          setprofessor(INITIAL_STATE);
          setVisible(true);
        }}
      >
        Criar Professor
      </Button>
      <ListView actions={actions} columns={columns} endpoint={endpoint}>
        {({ refetch }) => (
          <Modal
            title={`${professor.id ? "Update" : "Create"} Professor`}
            show={visible}
            handleClose={() => setVisible(false)}
            handleSave={() => handleSave(refetch)}
          >
            <Form>
              <Form.Group>
                <Form.Label>Professor Name</Form.Label>
                <Form.Control
                  name="professor"
                  onChange={(event) =>
                    setprofessor({ ...professor, name: event.target.value })
                  }
                  value={professor.name} />
              </Form.Group>

              <Form.Group>
                <Form.Label>Professor Name</Form.Label>
                <Form.Control
                  name="professor"
                  onChange={(event) =>
                    onChange={onChange}
                     
                  }
                 value={professor.name} />
              </Form.Group>
              <Form.Group className="mt-4">
                <Form.Label>Departament</Form.Label>
                <select
                  className="form-control"
                  name="department"
                  onChange={onChange}
                  value={professor}
                />
              </Form.Group>
            </Form>
          </Modal>
        )}
      </ListView>
    </Page>
  );
};

export default Professor;
