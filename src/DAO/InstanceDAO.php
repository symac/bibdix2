<?php

namespace Bibdix\DAO;

use Bibdix\Domain\Instance;

class InstanceDAO extends DAO
{
    /**
     * Returns a instance matching the supplied id.
     *
     * @param integer $id
     *
     * @return \Bibdix\Domain\Instance|throws an exception if no matching instance is found
     */
    public function find(int $id) {
        $sql = "select * from bibdix_instance where id=?";
        $row = $this->getDb()->fetchAssoc($sql, array($id));

        if ($row)
            return $this->buildDomainObject($row);
        else
            throw new \Exception("No instance matching id " . $id);
    }

    /**
     * Returns a instance matching the supplied code.
     *
     * @param string $code
     *
     * @return \Bibdix\Domain\Instance|throws an exception if no matching instance is found
     */
    public function findByCode(string $code) {
        $sql = "select * from bibdix_instance where code=?";
        $row = $this->getDb()->fetchAssoc($sql, array($code));

        if ($row)
            return $this->buildDomainObject($row);
        else
            throw new \Exception("No instance matching code " . $code);
    }

    /**
     * Return a list of all instances, sorted by label.
     *
     * @return array A list of all instances.
     */
    public function findAll() {
        $sql = "select * from bibdix_instance where actif=1 order by etab";
        $result = $this->getDb()->fetchAll($sql);

        // Convert query result to an array of domain objects
        $libraries = array();
        foreach ($result as $row) {
            $instanceId = $row['id'];
            $instances[$instanceId] = $this->buildDomainObject($row);
        }
        return $instances;
    }

    /**
     * Creates a Instance object based on a DB row.
     *
     * @param array $row The DB row containing Instance data.
     * @return \Planning\Domain\Library
     */
    protected function buildDomainObject(array $row) {
        $instance = new Instance();
        $instance->setId($row['id']);
        $instance->setCode($row['code']);
        $instance->setNom($row['nom']);
        $instance->setEtab($row['etab']);
        $instance->setDescription($row['description']);
        $instance->setUrl0($row['url_0']);
        $instance->setUrl1($row['url_1']);
        $instance->setRcr($row['rcr']);
        $instance->setChromeAppId($row['chrome_app_id']);
        $instance->setSecretKey($row['secret_key']);
        $instance->setFirefoxAppId($row['firefox_app_id']);        
        return $instance;
    }

    /**
     * Saves a Instance into the database.
     *
     * @param \Bibdix\Domain\Instance $instance The instance to save
     */
    public function save(Instance $instance) {
        $instanceData = array(

            );

        if ($instance->getId()) {
            $this->getDb()->update('bibdix_instance', $instanceData, array('id' => $instance->getId()));
        } else {
            // The article has never been saved : insert it
            $this->getDb()->insert('bibdix_instance', $instanceData);
            $id = $this->getDb()->lastInsertId();
            $instance->setId($id);
        }
    }

    /**
     * Removes a instance from the database.
     *
     * @param integer $id The instance id.
     */
    public function delete($id) {
        // Delete the instance
        $this->getDb()->delete('bibdix_instance', array('id' => $id));
    }

}