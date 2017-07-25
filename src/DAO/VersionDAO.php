<?php

namespace Bibdix\DAO;

use Bibdix\Domain\Version;

class VersionDAO extends DAO
{
    /**
     * Returns a version matching the id.
     *
     * @param integer $id
     *
     * @return \Bibdix\Domain\Version|throws an exception if no matching instance is found
     */
    public function find(int $id) {
        $sql = "select * from bibdix_version where id=?";
        $row = $this->getDb()->fetchAssoc($sql, array($id));

        if ($row)
            return $this->buildDomainObject($row);
        else
            throw new \Exception("No version matching id " . $id);
    }

    /**
     * Return a list of all instances, sorted by label.
     *
     * @return array A list of all instances.
     */
    public function findAll() {
        $sql = "select * from bibdix_version order by release_date";
        $result = $this->getDb()->fetchAll($sql);

        // Convert query result to an array of domain objects
        $versions = array();
        foreach ($result as $row) {
            $versionId = $row['id'];
            $versions[$versionId] = $this->buildDomainObject($row);
        }
        return $versions;
    }

    /**
     * Creates a Instance object based on a DB row.
     *
     * @param array $row The DB row containing Instance data.
     * @return \Planning\Domain\Library
     */
    protected function buildDomainObject(array $row) {
        $version = new Version();
        $version->setId($row['id']);
        $version->setPath($row['path']);
        $version->setVersion($row['version']);
        $version->setVersionName($row['version_name']);
        $version->setReleaseDate($row['release_date']);
        $version->setReleaseNotes($row['release_notes']);
        $version->setChrome($row['chrome']);
        $version->setFirefox($row['firefox']);
        return $version;
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